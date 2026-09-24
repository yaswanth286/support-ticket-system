const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash, role }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return findById(result.insertId);
}

async function listAgents() {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE role = 'agent' ORDER BY name ASC"
  );
  return rows;
}

async function listAllUsers() {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY name ASC'
  );
  return rows;
}

module.exports = { findByEmail, findById, createUser, listAgents, listAllUsers };
