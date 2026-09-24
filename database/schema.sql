-- Support Ticket Management System
-- MySQL schema

CREATE DATABASE IF NOT EXISTS support_tickets
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE support_tickets;

DROP TABLE IF EXISTS ticket_comments;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

-- ========================
-- users
-- ========================
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer', 'agent') NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ========================
-- tickets
-- ========================
CREATE TABLE tickets (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  subject      VARCHAR(200) NOT NULL,
  description  TEXT NOT NULL,
  priority     ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status       ENUM('open', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
  assigned_to  INT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tickets_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_tickets_agent
    FOREIGN KEY (assigned_to) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_tickets_user_id (user_id),
  INDEX idx_tickets_assigned_to (assigned_to),
  INDEX idx_tickets_status (status),
  INDEX idx_tickets_priority (priority)
) ENGINE=InnoDB;

-- ========================
-- ticket_comments
-- ========================
CREATE TABLE ticket_comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id  INT NOT NULL,
  user_id    INT NOT NULL,
  comment    TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_ticket
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  INDEX idx_comments_ticket_id (ticket_id),
  INDEX idx_comments_user_id (user_id)
) ENGINE=InnoDB;

-- Example JOIN query referenced by the assessment:
-- SELECT tickets.id, tickets.subject, tickets.status,
--        users.name AS customer_name, users.email
-- FROM tickets
-- JOIN users ON tickets.user_id = users.id
-- WHERE tickets.status = 'open';
