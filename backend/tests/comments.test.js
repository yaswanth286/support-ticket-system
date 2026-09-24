const request = require('supertest');
const app = require('../app');
const { createTestUser, closePool } = require('./testUtils');

let customer;
let customerToken;
let agentToken;
let ticketId;

beforeAll(async () => {
  const stamp = Date.now();
  const customerData = await createTestUser({
    name: 'Comment Customer',
    email: `comment.customer.${stamp}@example.com`,
    password: 'Password123',
    role: 'customer',
  });
  customer = customerData.user;
  customerToken = customerData.token;

  const agentData = await createTestUser({
    name: 'Comment Agent',
    email: `comment.agent.${stamp}@example.com`,
    password: 'Password123',
    role: 'agent',
  });
  agentToken = agentData.token;

  const ticketRes = await request(app)
    .post('/api/tickets')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ subject: 'Comment test ticket', description: 'Needs comments', priority: 'low' });
  ticketId = ticketRes.body.data.id;
});

afterAll(async () => {
  await closePool();
});

describe('Comments', () => {
  it('allows the ticket owner (customer) to add a comment', async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ comment: 'Any update on this?' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.author_name).toBe(customer.name);
  });

  it('allows an agent to comment on any ticket', async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ comment: "We're looking into it." });

    expect(res.statusCode).toBe(201);
  });

  it('rejects an empty comment', async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ comment: '   ' });

    expect(res.statusCode).toBe(400);
  });

  it('returns comments including author name', async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });
});
