import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/database.js';

let server;
let baseUrl;
let adminToken = '';
let customerToken = '';

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

describe('FreshFruit Market Admin API Suite', () => {
  before(async () => {
    await connectDB();
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });

    // 1. Login as Admin
    const adminRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'admin@freshfruit.demo', password: 'DemoPass123!' },
    });
    assert.equal(adminRes.status, 200);
    adminToken = adminRes.body.data.token;

    // 2. Login as Customer
    const custRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'customer@freshfruit.demo', password: 'DemoPass123!' },
    });
    assert.equal(custRes.status, 200);
    customerToken = custRes.body.data.token;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await disconnectDB();
  });

  test('GET /api/v1/admin/dashboard rejects unauthenticated request with 401', async () => {
    const res = await request('/api/v1/admin/dashboard');
    assert.equal(res.status, 401);
  });

  test('GET /api/v1/admin/dashboard rejects customer token with 403 Forbidden', async () => {
    const res = await request('/api/v1/admin/dashboard', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(res.status, 403);
    assert.match(res.body.message, /forbidden/i);
  });

  test('GET /api/v1/admin/dashboard succeeds for Admin and returns 12 KPIs', async () => {
    const res = await request('/api/v1/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    const kpis = res.body.data.kpis;
    assert.ok(typeof kpis.totalCustomers === 'number');
    assert.ok(typeof kpis.totalSellers === 'number');
    assert.ok(typeof kpis.totalDeliveryPartners === 'number');
    assert.ok(typeof kpis.totalProducts === 'number');
    assert.ok(typeof kpis.totalOrders === 'number');
    assert.ok(typeof kpis.totalRevenue === 'number');
    assert.ok(typeof kpis.pendingSellerApprovals === 'number');
    assert.ok(typeof kpis.pendingProductApprovals === 'number');
    assert.ok(typeof kpis.pendingRefunds === 'number');
    assert.ok(typeof kpis.activeDeliveries === 'number');
    assert.ok(typeof kpis.lowStockProducts === 'number');
    assert.ok(typeof kpis.totalSupportTickets === 'number');
  });

  test('GET /api/v1/admin/analytics returns valid metrics for period', async () => {
    const res = await request('/api/v1/admin/analytics?period=30d', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.dailyMetrics));
    assert.ok(Array.isArray(res.body.data.ordersByStatus));
    assert.ok(Array.isArray(res.body.data.categorySales));
  });

  test('GET /api/v1/admin/users lists users with pagination', async () => {
    const res = await request('/api/v1/admin/users?page=1&limit=5', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.users));
    assert.ok(res.body.data.pagination.total >= 5);
  });

  test('GET /api/v1/admin/products returns catalog with categories', async () => {
    const res = await request('/api/v1/admin/products', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.products));
  });

  test('GET /api/v1/admin/categories returns categories with product counts', async () => {
    const res = await request('/api/v1/admin/categories', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
  });

  test('GET /api/v1/admin/orders returns orders list', async () => {
    const res = await request('/api/v1/admin/orders', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.orders));
  });

  test('GET /api/v1/admin/settings returns platform settings', async () => {
    const res = await request('/api/v1/admin/settings', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.currency, 'INR');
  });
});

