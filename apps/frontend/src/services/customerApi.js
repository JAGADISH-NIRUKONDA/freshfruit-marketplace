const API_BASE = 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('freshfruit_jwt') || sessionStorage.getItem('freshfruit_jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const customerApi = {
  // 1. Dashboard Overview Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/customer/dashboard-stats`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch dashboard stats');
    return json.data;
  },

  // 2. Orders Management
  async getOrders(query = {}) {
    const params = new URLSearchParams();
    if (query.status && query.status !== 'all') params.append('status', query.status);
    if (query.search) params.append('search', query.search);
    if (query.page) params.append('page', query.page);
    if (query.limit) params.append('limit', query.limit);

    const res = await fetch(`${API_BASE}/customer/orders?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch customer orders');
    return json.data;
  },

  async getOrderById(orderId) {
    const res = await fetch(`${API_BASE}/customer/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch order details');
    return json.data;
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/customer/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to place order');
    return json.data;
  },

  async cancelOrder(orderId, reason = 'Cancelled by customer') {
    const res = await fetch(`${API_BASE}/customer/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to cancel order');
    return json.data;
  },

  // 3. Cart Management
  async getCart() {
    const res = await fetch(`${API_BASE}/customer/cart`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch cart');
    return json.data;
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/customer/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to add item to cart');
    return json.data;
  },

  async updateCartQuantity(productId, quantity) {
    const res = await fetch(`${API_BASE}/customer/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update cart quantity');
    return json.data;
  },

  async removeFromCart(productId) {
    const res = await fetch(`${API_BASE}/customer/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to remove from cart');
    return json.data;
  },

  // 4. Wishlist Management
  async getWishlist() {
    const res = await fetch(`${API_BASE}/customer/wishlist`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch wishlist');
    return json.data;
  },

  async toggleWishlist(productId) {
    const res = await fetch(`${API_BASE}/customer/wishlist/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update wishlist');
    return json.data;
  },

  // 5. Addresses Management
  async getAddresses() {
    const res = await fetch(`${API_BASE}/customer/addresses`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch addresses');
    return json.data;
  },

  async addAddress(addressData) {
    const res = await fetch(`${API_BASE}/customer/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to add address');
    return json.data;
  },

  async updateAddress(addressId, addressData) {
    const res = await fetch(`${API_BASE}/customer/addresses/${addressId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update address');
    return json.data;
  },

  async deleteAddress(addressId) {
    const res = await fetch(`${API_BASE}/customer/addresses/${addressId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete address');
    return json.data;
  },

  async setDefaultAddress(addressId) {
    const res = await fetch(`${API_BASE}/customer/addresses/${addressId}/default`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to set default address');
    return json.data;
  },

  // 6. Reviews & Ratings
  async getReviews() {
    const res = await fetch(`${API_BASE}/customer/reviews`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch reviews');
    return json.data;
  },

  async createReview(reviewData) {
    const res = await fetch(`${API_BASE}/customer/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to submit review');
    return json.data;
  },

  // 7. Offers & Coupons
  async getOffers() {
    const res = await fetch(`${API_BASE}/customer/offers`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch offers');
    return json.data;
  },

  async validateCoupon(code, orderAmount = 0) {
    const res = await fetch(`${API_BASE}/customer/coupons/validate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, orderAmount }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Invalid coupon code');
    return json.data;
  },

  // 8. Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/customer/notifications`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch notifications');
    return json.data;
  },

  async markNotificationRead(notificationId) {
    const res = await fetch(`${API_BASE}/customer/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update notification');
    return json.data;
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/customer/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to mark all as read');
    return json.data;
  },

  // 9. Support Tickets
  async getTickets() {
    const res = await fetch(`${API_BASE}/customer/tickets`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch tickets');
    return json.data;
  },

  async createTicket(ticketData) {
    const res = await fetch(`${API_BASE}/customer/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ticketData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create support ticket');
    return json.data;
  },

  async addTicketMessage(ticketId, message) {
    const res = await fetch(`${API_BASE}/customer/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to send message');
    return json.data;
  },

  // 10. Profile & Account
  async getProfile() {
    const res = await fetch(`${API_BASE}/customer/profile`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch profile');
    return json.data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/customer/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update profile');
    return json.data;
  },

  async changePassword(passwordData) {
    const res = await fetch(`${API_BASE}/customer/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to change password');
    return json.data;
  },
};
