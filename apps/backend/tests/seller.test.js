import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/database.js';
import { Category } from '../src/modules/admin/models/category.model.js';

let server;
let baseUrl;
let sellerToken = '';
let customerToken = '';
let testCategoryId = '';
let createdProductId = '';

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

describe('FreshFruit Market Seller & Farmer Experience Suite', () => {
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

    // Login as Demo Seller
    const sellerRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'seller@freshfruit.demo', password: 'DemoPass123!' },
    });
    assert.equal(sellerRes.status, 200);
    sellerToken = sellerRes.body.data.token;

    // Login as Demo Customer
    const custRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: { email: 'customer@freshfruit.demo', password: 'DemoPass123!' },
    });
    assert.equal(custRes.status, 200);
    customerToken = custRes.body.data.token;

    // Get an existing category
    const cat = await Category.findOne({ slug: 'fruits' });
    if (cat) {
      testCategoryId = cat._id.toString();
    } else {
      const anyCat = await Category.findOne();
      testCategoryId = anyCat?._id.toString();
    }
  });

  after(async () => {
    if (createdProductId) {
      await request(`/api/v1/seller/products/${createdProductId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${sellerToken}` },
      });
    }
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();
  });

  // 1. RBAC Tests
  test('GET /api/v1/seller/profile rejects unauthenticated request with 401', async () => {
    const res = await request('/api/v1/seller/profile');
    assert.equal(res.status, 401);
  });

  test('GET /api/v1/seller/profile rejects customer token with 403 Forbidden', async () => {
    const res = await request('/api/v1/seller/profile', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(res.status, 403);
  });

  // 2. Seller Profile & Stats
  test('GET /api/v1/seller/profile succeeds for verified Seller', async () => {
    const res = await request('/api/v1/seller/profile', {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.user);
    assert.ok(res.body.data.profile);
  });

  test('PUT /api/v1/seller/profile updates farm details', async () => {
    const res = await request('/api/v1/seller/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: {
        farmName: 'Sharma Alpine Organic Orchards',
        bio: 'Eco-certified grower producing pristine apples and stone fruits.',
        farmAddress: { city: 'Shimla', state: 'Himachal Pradesh' },
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.profile.farmName, 'Sharma Alpine Organic Orchards');
  });

  test('GET /api/v1/seller/stats returns seller KPI metrics', async () => {
    const res = await request('/api/v1/seller/stats', {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });
    assert.equal(res.status, 200);
    assert.ok('totalProducts' in res.body.data);
    assert.ok('totalUnitsAvailable' in res.body.data);
    assert.ok('farmerRating' in res.body.data);
  });

  // 3. Seller Product CRUD & Ownership
  test('POST /api/v1/seller/products creates a new product owned by seller', async () => {
    const res = await request('/api/v1/seller/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: {
        name: 'Kinnaur Crisp Red Apples',
        description: 'Crisp mountain apples cultivated at 8000 ft altitude with natural glacial water.',
        categoryId: testCategoryId,
        price: 240,
        discountPrice: 220,
        unit: '1 kg box',
        availableQuantity: 45,
        grade: 'A',
        isOrganic: true,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80',
      },
    });
    assert.equal(res.status, 201);
    assert.ok(res.body.data.product.id);
    createdProductId = res.body.data.product.id;
    assert.equal(res.body.data.product.name, 'Kinnaur Crisp Red Apples');
  });

  test('GET /api/v1/seller/products lists products belonging to seller', async () => {
    const res = await request('/api/v1/seller/products', {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.products));
    const found = res.body.data.products.find((p) => p.id === createdProductId);
    assert.ok(found);
  });

  test('PUT /api/v1/seller/products/:id updates seller product', async () => {
    const res = await request(`/api/v1/seller/products/${createdProductId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: {
        price: 230,
        availableQuantity: 50,
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.product.price, 230);
    assert.equal(res.body.data.product.availableQuantity, 50);
  });

  test('PATCH /api/v1/seller/inventory/:id adjusts available stock', async () => {
    const res = await request(`/api/v1/seller/inventory/${createdProductId}/adjust`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: { delta: 15 },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.product.availableQuantity, 65);
  });

  // 4. Public Farmer Directory & Storefront
  test('GET /api/v1/farmers lists verified organic farmers', async () => {
    const res = await request('/api/v1/farmers');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.farmers));
    assert.ok(res.body.data.farmers.length > 0);
  });

  test('GET /api/v1/farmers/:id/storefront returns farmer details and harvest products', async () => {
    const farmersRes = await request('/api/v1/farmers');
    const firstFarmer = farmersRes.body.data.farmers[0];
    assert.ok(firstFarmer);

    const storefrontRes = await request(`/api/v1/farmers/${firstFarmer.id}/storefront`);
    assert.equal(storefrontRes.status, 200);
    assert.ok(storefrontRes.body.data.farmer);
    assert.ok(Array.isArray(storefrontRes.body.data.products));
  });

  test('POST /api/v1/farmers/:id/inquiry relays inquiry to farmer', async () => {
    const farmersRes = await request('/api/v1/farmers');
    const firstFarmer = farmersRes.body.data.farmers[0];

    const res = await request(`/api/v1/farmers/${firstFarmer.id}/inquiry`, {
      method: 'POST',
      body: {
        name: 'Anita Verma',
        email: 'anita@example.com',
        phone: '+91 98200 11223',
        message: 'Looking to purchase 50 kg of organic apples for family event.',
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });
});

