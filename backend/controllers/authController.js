const userService = require('../services/userService');
const authService = require('../services/authService');
const { isNonEmptyString, isValidEmail, isValidPassword } = require('../middleware/validate');

function sanitizeUser(user) {
  // Never return password_hash to the client.
  const { password_hash, ...safeUser } = user; // eslint-disable-line no-unused-vars
  return safeUser;
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name)) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await userService.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const passwordHash = await authService.hashPassword(password);

    // Public registration can NEVER create an agent account, regardless of
    // what the client sends. Role is hardcoded here.
    const user = await userService.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'customer',
    });

    const token = authService.generateToken(user);

    return res.status(201).json({ success: true, data: { user: sanitizeUser(user), token } });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userService.findByEmail(normalizedEmail);

    // Use the same vague error whether the email doesn't exist or the
    // password is wrong, so we don't leak which emails are registered.
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatches = await authService.comparePassword(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = authService.generateToken(user);

    return res.status(200).json({ success: true, data: { user: sanitizeUser(user), token } });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };
