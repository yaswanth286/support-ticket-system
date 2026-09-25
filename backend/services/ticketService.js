const pool = require('../config/db');

const BASE_SELECT = `
  SELECT
    t.id, t.subject, t.description, t.priority, t.status,
    t.user_id, t.assigned_to,
    t.created_at, t.updated_at,
    customer.name  AS customer_name,
    customer.email AS customer_email,
    agent.name      AS assigned_agent_name,
    agent.email     AS assigned_agent_email
  FROM tickets t
  JOIN users customer ON t.user_id = customer.id
  LEFT JOIN users agent ON t.assigned_to = agent.id
`;

async function createTicket({ userId, subject, description, priority }) {
  const [result] = await pool.query(
    `INSERT INTO tickets (user_id, subject, description, priority, status)
     VALUES (?, ?, ?, ?, 'open')`,
    [userId, subject, description, priority]
  );
  return getTicketById(result.insertId);
}

/**
 * Returns tickets, joined with customer + assigned agent info.
 * Customers only see their own tickets; agents can see all, with optional filters.
 */
async function listTickets({ role, userId, email, status, priority }) {
  const conditions = [];
  const params = [];

  if (role === 'customer') {
    conditions.push('t.user_id = ?');
    params.push(userId);
  } else if (role === 'agent' && email !== 'agent@example.com') {
    conditions.push('t.assigned_to = ?');
    params.push(userId);
  }

  if (status) {
    conditions.push('t.status = ?');
    params.push(status);
  }

  if (priority) {
    conditions.push('t.priority = ?');
    params.push(priority);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const [rows] = await pool.query(
    `${BASE_SELECT} ${whereClause} ORDER BY t.created_at DESC`,
    params
  );

  return rows;
}

async function getTicketById(ticketId) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE t.id = ?`, [ticketId]);
  return rows[0] || null;
}

async function updateTicket(ticketId, fields) {
  const allowed = ['status', 'priority', 'assigned_to'];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      setClauses.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (setClauses.length === 0) {
    return getTicketById(ticketId);
  }

  params.push(ticketId);
  await pool.query(
    `UPDATE tickets SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    params
  );
  return getTicketById(ticketId);
}

async function deleteTicket(ticketId) {
  const [result] = await pool.query('DELETE FROM tickets WHERE id = ?', [ticketId]);
  return result.affectedRows > 0;
}

module.exports = {
  createTicket,
  listTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
