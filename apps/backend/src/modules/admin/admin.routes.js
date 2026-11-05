import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import * as adminController from './admin.controller.js';

const router = Router();

// Protect all admin routes with authentication and server-side admin role check
router.use(authenticate, authorize('admin'));

// 1. Dashboard & Analytics
router.get('/dashboard', adminController.getDashboardOverview);
router.get('/analytics', adminController.getAnalytics);

// 2. User Management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.patch('/users/:id/role', adminController.updateUserRole);

// 3. Seller Management
router.get('/sellers', adminController.getSellers);
router.patch('/sellers/:id/verification', adminController.updateSellerVerification);

// 4. Product Management
router.get('/products', adminController.getProducts);
router.patch('/products/:id/status', adminController.updateProductStatus);

// 5. Category Management
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// 6. Inventory Management
router.get('/inventory', adminController.getInventory);
router.patch('/inventory/:id/adjust', adminController.adjustStock);

// 7. Order Operations
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// 8. Payments & Refunds
router.get('/payments', adminController.getPayments);
router.get('/refunds', adminController.getRefunds);
router.patch('/refunds/:id/decision', adminController.updateRefundDecision);

// 9. Delivery Management
router.get('/deliveries', adminController.getDeliveries);
router.post('/deliveries/assign', adminController.assignDeliveryPartner);

// 10. Customer Engagement
router.get('/reviews', adminController.getReviews);
router.patch('/reviews/:id/moderate', adminController.moderateReview);
router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.patch('/coupons/:id/toggle', adminController.toggleCoupon);
router.get('/support', adminController.getSupportTickets);
router.post('/support/:id/reply', adminController.replySupportTicket);
router.patch('/support/:id/status', adminController.updateTicketStatus);
router.get('/notifications', adminController.getNotifications);
router.post('/notifications', adminController.sendNotification);

// 11. System Management & Reports
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.get('/reports', adminController.getReports);

export default router;

