import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/database.js';
import { User } from '../src/modules/auth/user.model.js';

let server;
let baseUrl;

const request = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);
  return {
    status: response.status,
    headers: response.headers,
    body: data,
  };
};

describe('FreshFruit Market Backend Foundation Tests', () => {
  const testUser = {
    name: 'Test Farmer',
    email: `farmer_${Date.now()}@freshfruit.local`,
    password: 'SecurePassword123!',
    role: 'seller',
    phone: '+91 9876543210',
  };

  let authToken = '';

  before(async () => {
    await connectDB();
    // Start temporary HTTP server on random free port
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        console.log(`[Test Suite] Test server running on ${baseUrl}`);
        resolve();
      });
    });
  });

  after(async () => {
    // Cleanup test user
    if (testUser.email) {
      await User.deleteOne({ email: testUser.email });
    }
    await new Promise((resolve) => server.close(resolve));
    await disconnectDB();
  });

  // 1. Health Check Test
  test('GET /api/v1/health returns 200 with service and db info', async () => {
    const res = await request('/api/v1/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.service, 'freshfruit-market-api');
    assert.equal(res.body.data.database.status, 'connected');
    assert.equal(res.body.data.database.databaseName, 'freshfarm_connect');
  });

  // 2. User Registration Success
  test('POST /api/v1/auth/register creates a new user and returns JWT token', async () => {
    const res = await request('/api/v1/auth/register', {
      method: 'POST',
      body: testUser,
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token, 'Should return a JWT token');
    assert.equal(res.body.data.user.email, testUser.email);
    assert.equal(res.body.data.user.name, testUser.name);
    assert.equal(res.body.data.user.role, 'seller');
    assert.equal(res.body.data.user.passwordHash, undefined, 'passwordHash must not be exposed');

    authToken = res.body.data.token;
  });

  // 3. Duplicate User Registration Failure (409)
  test('POST /api/v1/auth/register rejects duplicate email with 409', async () => {
    const res = await request('/api/v1/auth/register', {
      method: 'POST',
      body: testUser,
    });

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /already exists/i);
  });

  // 4. Registration Validation Errors (Zod)
  test('POST /api/v1/auth/register rejects invalid inputs with 400', async () => {
    const res = await request('/api/v1/auth/register', {
      method: 'POST',
      body: {
        name: 'A', // too short (<2)
        email: 'not-an-email',
        password: '123', // too short (<6)
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
    assert.ok(res.body.errors.length >= 3);
  });

  // 5. User Login Success
  test('POST /api/v1/auth/login authenticates with valid credentials', async () => {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.email, testUser.email);
  });

  // 6. User Login with Invalid Password (401)
  test('POST /api/v1/auth/login rejects wrong password with 401', async () => {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: {
        email: testUser.email,
        password: 'WrongPassword!',
      },
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /invalid email or password/i);
  });

  // 7. User Login with Non-Existent Email (401)
  test('POST /api/v1/auth/login rejects unknown email with 401', async () => {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: {
        email: 'does_not_exist@freshfruit.local',
        password: 'Password123!',
      },
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  // 8. Protected GET /api/v1/auth/me Success
  test('GET /api/v1/auth/me returns current user profile with valid Bearer token', async () => {
    const res = await request('/api/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, testUser.email);
    assert.equal(res.body.data.user.name, testUser.name);
    assert.equal(res.body.data.user.role, 'seller');
  });

  // 9. Protected GET /api/v1/auth/me Rejection without Token (401)
  test('GET /api/v1/auth/me rejects request without token with 401', async () => {
    const res = await request('/api/v1/auth/me');

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  // 10. Protected GET /api/v1/auth/me Rejection with Invalid Token (401)
  test('GET /api/v1/auth/me rejects request with invalid token with 401', async () => {
    const res = await request('/api/v1/auth/me', {
      headers: {
        Authorization: 'Bearer invalid.token.payload',
      },
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });
});

