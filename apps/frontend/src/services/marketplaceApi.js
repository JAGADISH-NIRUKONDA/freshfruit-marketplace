const API_BASE = 'http://localhost:5000/api/v1';

export const marketplaceApi = {
  // Health check
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  // Products
  async getProducts({ category = 'all', search = '', sort = 'rating', limit = 24 } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return json.data || { products: [] };
  },

  // Single Product Details
  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    const json = await res.json();
    return json.data?.product || null;
  },

  // Live Search Suggestions
  async getSearchSuggestions(q) {
    if (!q || !q.trim()) return [];
    const res = await fetch(`${API_BASE}/products/suggestions?q=${encodeURIComponent(q.trim())}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.suggestions || [];
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return json.data?.categories || [];
  },

  // Farmers Directory
  async getFarmers() {
    const res = await fetch(`${API_BASE}/farmers`);
    if (!res.ok) throw new Error('Failed to fetch farmers');
    const json = await res.json();
    return json.data?.farmers || [];
  },

  // Single Farmer Profile
  async getFarmerById(id) {
    const res = await fetch(`${API_BASE}/farmers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch farmer profile');
    const json = await res.json();
    return json.data?.farmer || null;
  },

  // Farmer Storefront with products
  async getFarmerStorefront(id, { search = '', category = 'all', sort = 'newest' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);
    if (sort) params.append('sort', sort);

    const res = await fetch(`${API_BASE}/farmers/${id}/storefront?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch farmer storefront');
    const json = await res.json();
    return json.data || { farmer: null, products: [] };
  },

  // Send Inquiry to Farmer
  async sendFarmerInquiry(id, data) {
    const res = await fetch(`${API_BASE}/farmers/${id}/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to send inquiry');
    return json;
  },

  // Reviews
  async getReviews() {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const json = await res.json();
    return json.data?.reviews || [];
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Subscription failed');
    return json;
  },
};

