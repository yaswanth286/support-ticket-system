const mysql = require('mysql2/promise');

require('dotenv').config();

// Use a separate database when running Jest tests.
const database =
  process.env.NODE_ENV === 'test'
    ? 'support_tickets_test'
    : (process.env.DB_NAME || 'support_tickets');

// Enable SSL for hosted MySQL providers such as Aiven.
// Local development remains unchanged.
const ssl =
  process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : undefined;

// Central MySQL connection pool.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl,
});

module.exports = pool;