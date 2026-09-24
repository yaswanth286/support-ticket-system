const userService = require('../services/userService');

// Agent-only. Returns a safe list of users for assignment purposes.
// Prefer returning agents only (never password hashes).
async function getUsers(req, res, next) {
  try {
    const { role } = req.query;
    const users = role === 'all' ? await userService.listAllUsers() : await userService.listAgents();
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getUsers };
