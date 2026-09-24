const request = require('supertest');
const app = require('../app');
const { closePool } = require('./testUtils');

afterAll(async () => {
  await closePool();
});

describe('Authentication', () => {
  const uniqueEmail = `test.user.${Date.now()}@example.com`;

  it('registers a new customer successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: uniqueEmail,
      password: 'Password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('customer');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password_hash).toBeUndefined();
  });

  it('rejects duplicate registration with the same email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: uniqueEmail,
      password: 'Password123',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('logs in successfully with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: uniqueEmail,
      password: 'Password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('returns 401 for an incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: uniqueEmail,
      password: 'WrongPassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('returns 401 when accessing a protected route without a token', async () => {
    const res = await request(app).get('/api/tickets');
    expect(res.statusCode).toBe(401);
  });
});
