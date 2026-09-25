const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Verifies the JWT sent in the Authorization header (format: "Bearer <token>").
 * On success, attaches { id, role } to req.user and calls next().
 * On failure, responds with 401 (never 403 - authentication vs authorization are different).
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or malformed authorization token' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Missing authentication token' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
req.user = {
  id: decoded.id,
  role: decoded.role,
  email: decoded.email,
};
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
}

/**
 * Restricts a route to one or more roles. Must be used after `authenticate`.
 * Usage: requireRole('agent') or requireRole('agent', 'customer')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
