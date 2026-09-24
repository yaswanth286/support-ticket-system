-- Demo seed data for the Support Ticket Management System
-- Run AFTER schema.sql

USE support_tickets;

-- Passwords are bcrypt hashes (10 salt rounds) corresponding to:
--   customer@example.com / Customer@123
--   agent@example.com    / Agent@123
INSERT INTO users (name, email, password_hash, role) VALUES
  ('John Customer', 'customer@example.com', '$2b$10$ZB64rfLK1U4//yzOjLNZHORwAkk58BCJWGjcWj5CbtZJscU5Z3SnS', 'customer'),
  ('Support Agent', 'agent@example.com', '$2b$10$6FgVZILJ6nGwrIxa40qx1.1FdzYmSaU5dQxugKkL.F56gckIr9NgC', 'agent'),
  ('Jane Doe', 'jane.doe@example.com', '$2b$10$ZB64rfLK1U4//yzOjLNZHORwAkk58BCJWGjcWj5CbtZJscU5Z3SnS', 'customer'),
  ('Alex Agent', 'alex.agent@example.com', '$2b$10$6FgVZILJ6nGwrIxa40qx1.1FdzYmSaU5dQxugKkL.F56gckIr9NgC', 'agent');

-- Sample tickets (user_id 1 = John Customer, 3 = Jane Doe, assigned_to 2 = Support Agent)
INSERT INTO tickets (user_id, subject, description, priority, status, assigned_to) VALUES
  (1, 'Cannot log into my account', 'I keep getting an "invalid credentials" error even though my password is correct.', 'high', 'open', 2),
  (1, 'Billing charge looks wrong', 'I was charged twice for my subscription this month. Can you check?', 'medium', 'in_progress', 2),
  (3, 'Feature request: dark mode', 'It would be great to have a dark mode option in the app settings.', 'low', 'open', NULL),
  (3, 'App crashes on upload', 'The app crashes every time I try to upload a file larger than 10MB.', 'high', 'closed', 2);

-- Sample comments
INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES
  (1, 2, 'Thanks for reporting this. Can you confirm which browser you are using?'),
  (1, 1, 'I am using the latest version of Chrome on Windows 11.'),
  (2, 2, 'I can see the duplicate charge. Processing a refund now.'),
  (4, 2, 'This has been fixed in the latest release. Please update the app and let us know if it persists.'),
  (4, 3, 'Confirmed, the update fixed it for me. Thank you!');
