const API_BASE = 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('freshfruit_jwt') || localStorage.getItem('freshfruit_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || (data.errors ? data.errors[0]?.message : 'Request failed'));
  }
  return data.data;
};

export const adminApi = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('freshfruit_admin_token', data.token);
      localStorage.setItem('freshfruit_jwt', data.token);
    }
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Dashboard Overview
  getDashboardOverview: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Analytics
  getAnalytics: async (period = '30d') => {
    const res = await fetch(`${API_BASE}/admin/analytics?period=${period}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Users
  getUsers: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/users?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateUserStatus: async (id, isActive) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });
    return handleResponse(res);
  },

  updateUserRole: async (id, role) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },

  // Sellers
  getSellers: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/sellers?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateSellerVerification: async (id, status, rejectionReason = '') => {
    const res = await fetch(`${API_BASE}/admin/sellers/${id}/verification`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, rejectionReason }),
    });
    return handleResponse(res);
  },

  // Products
  getProducts: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/products?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateProductStatus: async (id, status, rejectionReason = '') => {
    const res = await fetch(`${API_BASE}/admin/products/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, rejectionReason }),
    });
    return handleResponse(res);
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createCategory: async (categoryData) => {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return handleResponse(res);
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Inventory
  getInventory: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/inventory?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  adjustStock: async (id, adjustment, reason) => {
    const res = await fetch(`${API_BASE}/admin/inventory/${id}/adjust`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ adjustment, reason }),
    });
    return handleResponse(res);
  },

  // Orders
  getOrders: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/orders?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateOrderStatus: async (id, status, note = '') => {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note }),
    });
    return handleResponse(res);
  },

  // Payments & Refunds
  getPayments: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/payments?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getRefunds: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/refunds?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateRefundDecision: async (id, status, rejectionReason = '') => {
    const res = await fetch(`${API_BASE}/admin/refunds/${id}/decision`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, rejectionReason }),
    });
    return handleResponse(res);
  },

  // Deliveries
  getDeliveries: async () => {
    const res = await fetch(`${API_BASE}/admin/deliveries`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  assignDeliveryPartner: async (orderId, partnerId) => {
    const res = await fetch(`${API_BASE}/admin/deliveries/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, partnerId }),
    });
    return handleResponse(res);
  },

  // Reviews, Coupons, Support, Notifications
  getReviews: async () => {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  moderateReview: async (id, status, moderationNote = '') => {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}/moderate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, moderationNote }),
    });
    return handleResponse(res);
  },

  getCoupons: async () => {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createCoupon: async (couponData) => {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData),
    });
    return handleResponse(res);
  },

  toggleCoupon: async (id, isActive) => {
    const res = await fetch(`${API_BASE}/admin/coupons/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });
    return handleResponse(res);
  },

  getSupportTickets: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/support?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  replySupportTicket: async (id, message) => {
    const res = await fetch(`${API_BASE}/admin/support/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    return handleResponse(res);
  },

  updateTicketStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/admin/support/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  getNotifications: async () => {
    const res = await fetch(`${API_BASE}/admin/notifications`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  sendNotification: async (payload) => {
    const res = await fetch(`${API_BASE}/admin/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Audit Logs & Settings
  getAuditLogs: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/audit-logs?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getSettings: async () => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateSettings: async (settingsData) => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData),
    });
    return handleResponse(res);
  },

  getReports: async () => {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

