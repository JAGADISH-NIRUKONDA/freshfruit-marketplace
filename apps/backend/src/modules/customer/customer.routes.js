import { Router } from 'express';
import { customerController } from './customer.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Protect all customer routes with JWT authentication & role authorization
router.use(authenticate);
router.use(authorize('customer', 'admin'));

// 1. Dashboard Overview Stats
router.get('/dashboard-stats', customerController.getDashboardStats);

// 2. Orders & Tracking
router.get('/orders', customerController.getOrders);
router.get('/orders/:id', customerController.getOrderById);
router.post('/orders', customerController.createOrder);
router.patch('/orders/:id/cancel', customerController.cancelOrder);

// 3. Cart
router.get('/cart', customerController.getCart);
router.post('/cart', customerController.addToCart);
router.put('/cart/:productId', customerController.updateCartQuantity);
router.delete('/cart/:productId', customerController.removeFromCart);

// 4. Wishlist
router.get('/wishlist', customerController.getWishlist);
router.post('/wishlist/:productId', customerController.toggleWishlist);

// 5. Addresses
router.get('/addresses', customerController.getAddresses);
router.post('/addresses', customerController.addAddress);
router.put('/addresses/:id', customerController.updateAddress);
router.delete('/addresses/:id', customerController.deleteAddress);
router.patch('/addresses/:id/default', customerController.setDefaultAddress);

// 6. Reviews
router.get('/reviews', customerController.getReviews);
router.post('/reviews', customerController.createReview);

// 7. Offers & Coupons
router.get('/offers', customerController.getOffers);
router.post('/coupons/validate', customerController.validateCoupon);

// 8. Notifications
router.get('/notifications', customerController.getNotifications);
router.patch('/notifications/:id/read', customerController.markNotificationRead);
router.patch('/notifications/read-all', customerController.markAllNotificationsRead);

// 9. Support Tickets
router.get('/tickets', customerController.getTickets);
router.post('/tickets', customerController.createTicket);
router.post('/tickets/:id/messages', customerController.addTicketMessage);

// 10. Profile
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.put('/password', customerController.changePassword);

export default router;
