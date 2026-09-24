const pool = require('../config/db');

async function addComment({ ticketId, userId, comment }) {
  const [result] = await pool.query(
    'INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)',
    [ticketId, userId, comment]
  );
  const [rows] = await pool.query(
    `SELECT c.id, c.ticket_id, c.comment, c.created_at,
            u.name AS author_name, u.role AS author_role
     FROM ticket_comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = ?`,
    [result.insertId]
  );
  return rows[0];
}

async function listComments(ticketId) {
  const [rows] = await pool.query(
    `SELECT c.id, c.ticket_id, c.comment, c.created_at,
            u.name AS author_name, u.role AS author_role
     FROM ticket_comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.ticket_id = ?
     ORDER BY c.created_at ASC`,
    [ticketId]
  );
  return rows;
}

module.exports = { addComment, listComments };
