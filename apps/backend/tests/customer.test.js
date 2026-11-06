import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/database.js';
import { User } from '../src/modules/auth/user.model.js';
import { Product } from '../src/modules/admin/models/product.model.js';

let server;
let baseUrl;
let customerToken = '';
let testProductId = '';

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

describe('FreshFruit Market Customer Experience & Public Catalog Suite', () => {
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

    // Login as Demo Customer
    const custRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'customer@freshfruit.demo', password: 'DemoPass123!' },
    });
    assert.equal(custRes.status, 200);
    customerToken = custRes.body.data.token;

    // Grab a product for detail testing
    const prod = await Product.findOne({ status: 'active' });
    if (prod) {
      testProductId = prod._id.toString();
    }
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();
  });

  // 1. Authentication & Profile
  test('POST /api/v1/auth/login succeeds with valid customer credentials', async () => {
    const res = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'customer@freshfruit.demo', password: 'DemoPass123!' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.role, 'customer');
    assert.ok(res.body.data.token);
  });

  test('GET /api/v1/auth/me returns customer profile using valid Bearer token', async () => {
    const res = await request('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.user.role, 'customer');
    assert.equal(res.body.data.user.email, 'customer@freshfruit.demo');
  });

  // 2. Product Search & Catalog Filtering
  test('GET /api/v1/products returns public active products', async () => {
    const res = await request('/api/v1/products');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.products));
    assert.ok(res.body.data.products.length > 0);
  });

  test('GET /api/v1/products searches products by name keyword', async () => {
    const res = await request('/api/v1/products?search=apple');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.products));
    for (const p of res.body.data.products) {
      const match = p.name.toLowerCase().includes('apple') || p.description.toLowerCase().includes('apple');
      assert.ok(match, `Product ${p.name} does not match search term "apple"`);
    }
  });

  test('GET /api/v1/products/suggestions provides search suggestions', async () => {
    const res = await request('/api/v1/products/suggestions?q=a');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.suggestions));
  });

  test('GET /api/v1/products filters by category slug', async () => {
    const res = await request('/api/v1/products?category=fruits');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.products));
    for (const p of res.body.data.products) {
      assert.equal(p.category, 'fruits');
    }
  });

  test('GET /api/v1/products sorts products by price ascending', async () => {
    const res = await request('/api/v1/products?sort=price_asc');
    assert.equal(res.status, 200);
    const products = res.body.data.products;
    for (let i = 1; i < products.length; i++) {
      assert.ok(
        products[i].price >= products[i - 1].price,
        `Expected ${products[i].price} >= ${products[i - 1].price}`
      );
    }
  });

  test('GET /api/v1/products sorts products by price descending', async () => {
    const res = await request('/api/v1/products?sort=price_desc');
    assert.equal(res.status, 200);
    const products = res.body.data.products;
    for (let i = 1; i < products.length; i++) {
      assert.ok(
        products[i].price <= products[i - 1].price,
        `Expected ${products[i].price} <= ${products[i - 1].price}`
      );
    }
  });

  // 3. Product Details
  test('GET /api/v1/products/:id returns detailed product information', async () => {
    assert.ok(testProductId, 'No test product found in database');
    const res = await request(`/api/v1/products/${testProductId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.product.id, testProductId);
    assert.ok(res.body.data.product.name);
    assert.ok(typeof res.body.data.product.price === 'number');
    assert.ok(res.body.data.product.farm);
    assert.ok(res.body.data.product.farm.farmName);
  });

  test('GET /api/v1/products/:id returns 404 for non-existent product', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(`/api/v1/products/${fakeId}`);
    assert.equal(res.status, 404);
  });

  // 4. Public Categories, Farmers, Reviews & Newsletter
  test('GET /api/v1/categories returns list of active categories', async () => {
    const res = await request('/api/v1/categories');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.categories));
    assert.ok(res.body.data.categories.length > 0);
  });

  test('GET /api/v1/farmers returns list of verified organic farmers', async () => {
    const res = await request('/api/v1/farmers');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.farmers));
    assert.ok(res.body.data.farmers.length > 0);
  });

  test('GET /api/v1/reviews returns marketplace customer reviews', async () => {
    const res = await request('/api/v1/reviews');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.reviews));
  });

  test('POST /api/v1/newsletter/subscribe records subscriber email', async () => {
    const res = await request('/api/v1/newsletter/subscribe', {
      method: 'POST',
      body: { email: `qa_subscriber_${Date.now()}@example.com` },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });
});
