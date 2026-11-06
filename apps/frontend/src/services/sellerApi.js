const API_BASE = 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('freshfruit_jwt');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const sellerApi = {
  // 1. Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/seller/profile`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch seller profile');
    return json.data;
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/seller/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update seller profile');
    return json.data;
  },

  // 2. Dashboard KPIs & Metrics
  async getStats() {
    const res = await fetch(`${API_BASE}/seller/stats`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch dashboard metrics');
    return json.data;
  },

  // 3. Products Management
  async getProducts({ category = 'all', search = '', status = 'all', sort = 'newest' } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (sort) params.append('sort', sort);

    const res = await fetch(`${API_BASE}/seller/products?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch products');
    return json.data || { products: [], total: 0 };
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/seller/products/${id}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch product details');
    return json.data?.product;
  },

  async createProduct(data) {
    const res = await fetch(`${API_BASE}/seller/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create product');
    return json.data?.product;
  },

  async updateProduct(id, data) {
    const res = await fetch(`${API_BASE}/seller/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update product');
    return json.data?.product;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/seller/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete product');
    return json.data;
  },

  // 4. Quick Inventory / Stock Adjustment
  async adjustInventory(id, { availableQuantity, delta }) {
    const res = await fetch(`${API_BASE}/seller/inventory/${id}/adjust`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ availableQuantity, delta }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to adjust inventory');
    return json.data?.product;
  },

  // Categories helper
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data?.categories || [];
  },
};

