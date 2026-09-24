const pool = require('../config/db');
const authService = require('../services/authService');

// Creates a fresh customer + agent for use across the test suite, and
// returns their JWTs along with helper info. Assumes the test database
// schema already exists (run schema.sql against a TEST database first).
async function createTestUser({ name, email, password, role }) {
  const passwordHash = await authService.hashPassword(password);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  const user = { id: result.insertId, name, email, role };
  const token = authService.generateToken(user);
  return { user, token };
}

async function closePool() {
  await pool.end();
}

module.exports = { createTestUser, closePool };
