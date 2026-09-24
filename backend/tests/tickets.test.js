const request = require('supertest');
const app = require('../app');
const { createTestUser, closePool } = require('./testUtils');

let customer;
let customerToken;
let agent;
let agentToken;

beforeAll(async () => {
  const stamp = Date.now();
  const customerData = await createTestUser({
    name: 'Ticket Customer',
    email: `ticket.customer.${stamp}@example.com`,
    password: 'Password123',
    role: 'customer',
  });
  customer = customerData.user;
  customerToken = customerData.token;

  const agentData = await createTestUser({
    name: 'Ticket Agent',
    email: `ticket.agent.${stamp}@example.com`,
    password: 'Password123',
    role: 'agent',
  });
  agent = agentData.user;
  agentToken = agentData.token;
});

afterAll(async () => {
  await closePool();
});

describe('Tickets', () => {
  let createdTicketId;

  it('allows a customer to create a ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ subject: 'Test ticket', description: 'Something is broken', priority: 'medium' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user_id).toBe(customer.id);
    expect(res.body.data.status).toBe('open');
    createdTicketId = res.body.data.id;
  });

  it('returns 404 for a non-existent ticket', async () => {
    const res = await request(app)
      .get('/api/tickets/999999999')
      .set('Authorization', `Bearer ${agentToken}`);

    expect(res.statusCode).toBe(404);
  });

  it('allows an agent to update a ticket status and priority', async () => {
    const res = await request(app)
      .put(`/api/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ status: 'in_progress', priority: 'high' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('in_progress');
    expect(res.body.data.priority).toBe('high');
  });

  it('prevents a customer from updating a ticket (agent-only route)', async () => {
    const res = await request(app)
      .put(`/api/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'closed' });

    expect(res.statusCode).toBe(403);
  });
});
