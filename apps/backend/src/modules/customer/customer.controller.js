import { customerService } from './customer.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const customerController = {
  // Stats
  async getDashboardStats(req, res, next) {
    try {
      const data = await customerService.getDashboardStats(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Dashboard stats retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  // Orders
  async getOrders(req, res, next) {
    try {
      const data = await customerService.getOrders(req.user._id, req.query);
      return successResponse(res, { statusCode: 200, message: 'Orders retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async getOrderById(req, res, next) {
    try {
      const data = await customerService.getOrderById(req.user._id, req.params.id);
      return successResponse(res, { statusCode: 200, message: 'Order details retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async createOrder(req, res, next) {
    try {
      const data = await customerService.createOrder(req.user._id, req.body);
      return successResponse(res, { statusCode: 201, message: 'Order placed successfully', data });
    } catch (err) {
      next(err);
    }
  },

  async cancelOrder(req, res, next) {
    try {
      const data = await customerService.cancelOrder(req.user._id, req.params.id, req.body.reason);
      return successResponse(res, { statusCode: 200, message: 'Order cancelled successfully', data });
    } catch (err) {
      next(err);
    }
  },

  // Cart
  async getCart(req, res, next) {
    try {
      const data = await customerService.getCart(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Cart retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async addToCart(req, res, next) {
    try {
      const data = await customerService.addToCart(req.user._id, req.body.productId, req.body.quantity);
      return successResponse(res, { statusCode: 200, message: 'Added to cart', data });
    } catch (err) {
      next(err);
    }
  },

  async updateCartQuantity(req, res, next) {
    try {
      const data = await customerService.updateCartQuantity(req.user._id, req.params.productId, req.body.quantity);
      return successResponse(res, { statusCode: 200, message: 'Cart updated', data });
    } catch (err) {
      next(err);
    }
  },

  async removeFromCart(req, res, next) {
    try {
      const data = await customerService.removeFromCart(req.user._id, req.params.productId);
      return successResponse(res, { statusCode: 200, message: 'Removed from cart', data });
    } catch (err) {
      next(err);
    }
  },

  // Wishlist
  async getWishlist(req, res, next) {
    try {
      const data = await customerService.getWishlist(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Wishlist retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async toggleWishlist(req, res, next) {
    try {
      const data = await customerService.toggleWishlist(req.user._id, req.params.productId);
      return successResponse(res, { statusCode: 200, message: 'Wishlist updated', data });
    } catch (err) {
      next(err);
    }
  },

  // Addresses
  async getAddresses(req, res, next) {
    try {
      const data = await customerService.getAddresses(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Addresses retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async addAddress(req, res, next) {
    try {
      const data = await customerService.addAddress(req.user._id, req.body);
      return successResponse(res, { statusCode: 201, message: 'Address added', data });
    } catch (err) {
      next(err);
    }
  },

  async updateAddress(req, res, next) {
    try {
      const data = await customerService.updateAddress(req.user._id, req.params.id, req.body);
      return successResponse(res, { statusCode: 200, message: 'Address updated', data });
    } catch (err) {
      next(err);
    }
  },

  async deleteAddress(req, res, next) {
    try {
      const data = await customerService.deleteAddress(req.user._id, req.params.id);
      return successResponse(res, { statusCode: 200, message: 'Address deleted', data });
    } catch (err) {
      next(err);
    }
  },

  async setDefaultAddress(req, res, next) {
    try {
      const data = await customerService.setDefaultAddress(req.user._id, req.params.id);
      return successResponse(res, { statusCode: 200, message: 'Default address set', data });
    } catch (err) {
      next(err);
    }
  },

  // Reviews
  async getReviews(req, res, next) {
    try {
      const data = await customerService.getCustomerReviews(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Reviews retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async createReview(req, res, next) {
    try {
      const data = await customerService.createReview(req.user._id, req.body);
      return successResponse(res, { statusCode: 201, message: 'Review submitted', data });
    } catch (err) {
      next(err);
    }
  },

  // Offers & Coupons
  async getOffers(req, res, next) {
    try {
      const data = await customerService.getOffers();
      return successResponse(res, { statusCode: 200, message: 'Offers retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async validateCoupon(req, res, next) {
    try {
      const data = await customerService.validateCoupon(req.body.code, req.body.orderAmount);
      return successResponse(res, { statusCode: 200, message: 'Coupon validated', data });
    } catch (err) {
      next(err);
    }
  },

  // Notifications
  async getNotifications(req, res, next) {
    try {
      const data = await customerService.getNotifications(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Notifications retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async markNotificationRead(req, res, next) {
    try {
      const data = await customerService.markNotificationRead(req.user._id, req.params.id);
      return successResponse(res, { statusCode: 200, message: 'Notification marked read', data });
    } catch (err) {
      next(err);
    }
  },

  async markAllNotificationsRead(req, res, next) {
    try {
      const data = await customerService.markAllNotificationsRead(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'All notifications marked read', data });
    } catch (err) {
      next(err);
    }
  },

  // Tickets
  async getTickets(req, res, next) {
    try {
      const data = await customerService.getTickets(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Tickets retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async createTicket(req, res, next) {
    try {
      const data = await customerService.createTicket(req.user._id, req.body);
      return successResponse(res, { statusCode: 201, message: 'Support ticket created', data });
    } catch (err) {
      next(err);
    }
  },

  async addTicketMessage(req, res, next) {
    try {
      const data = await customerService.addTicketMessage(req.user._id, req.params.id, req.body.message);
      return successResponse(res, { statusCode: 200, message: 'Message sent', data });
    } catch (err) {
      next(err);
    }
  },

  // Profile
  async getProfile(req, res, next) {
    try {
      const data = await customerService.getProfile(req.user._id);
      return successResponse(res, { statusCode: 200, message: 'Profile retrieved', data });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const data = await customerService.updateProfile(req.user._id, req.body);
      return successResponse(res, { statusCode: 200, message: 'Profile updated', data });
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const data = await customerService.changePassword(req.user._id, req.body);
      return successResponse(res, { statusCode: 200, message: 'Password updated', data });
    } catch (err) {
      next(err);
    }
  },
};
