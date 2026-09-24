const request = require('supertest');
const app = require('../app');
const { createTestUser, closePool } = require('./testUtils');

let customerA;
let customerAToken;
let customerBToken;
let agentToken;
let ticketOwnedByA;

beforeAll(async () => {
  const stamp = Date.now();

  const a = await createTestUser({
    name: 'Customer A',
    email: `customer.a.${stamp}@example.com`,
    password: 'Password123',
    role: 'customer',
  });
  customerA = a.user;
  customerAToken = a.token;

  const b = await createTestUser({
    name: 'Customer B',
    email: `customer.b.${stamp}@example.com`,
    password: 'Password123',
    role: 'customer',
  });
  customerBToken = b.token;

  const agentData = await createTestUser({
    name: 'Authz Agent',
    email: `authz.agent.${stamp}@example.com`,
    password: 'Password123',
    role: 'agent',
  });
  agentToken = agentData.token;

  const ticketRes = await request(app)
    .post('/api/tickets')
    .set('Authorization', `Bearer ${customerAToken}`)
    .send({ subject: "Customer A's private ticket", description: 'Confidential issue', priority: 'medium' });
  ticketOwnedByA = ticketRes.body.data.id;
});

afterAll(async () => {
  await closePool();
});

describe('Authorization & ownership', () => {
  it("prevents Customer B from viewing Customer A's ticket", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketOwnedByA}`)
      .set('Authorization', `Bearer ${customerBToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('allows Customer A to view their own ticket', async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketOwnedByA}`)
      .set('Authorization', `Bearer ${customerAToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(ticketOwnedByA);
  });

  it('prevents a customer from accessing the agent-only users endpoint', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${customerAToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('allows an agent to access the users endpoint', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${agentToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('rejects requests with an invalid/malformed token', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.statusCode).toBe(401);
  });
});
