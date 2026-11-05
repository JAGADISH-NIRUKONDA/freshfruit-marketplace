import * as adminService from './admin.service.js';
import { successResponse } from '../../utils/response.js';

export const getDashboardOverview = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardOverview();
    return successResponse(res, { message: 'Dashboard overview fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsData(req.query.period);
    return successResponse(res, { message: 'Analytics data fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getUsers(req.query);
    return successResponse(res, { message: 'Users retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const data = await adminService.updateUserStatus(req.params.id, req.body.isActive, req.user);
    return successResponse(res, { message: 'User status updated successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const data = await adminService.updateUserRole(req.params.id, req.body.role, req.user);
    return successResponse(res, { message: 'User role updated successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getSellers = async (req, res, next) => {
  try {
    const data = await adminService.getSellers(req.query);
    return successResponse(res, { message: 'Sellers retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateSellerVerification = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const data = await adminService.updateSellerVerification(req.params.id, status, rejectionReason, req.user);
    return successResponse(res, { message: `Seller verification status set to ${status}`, data });
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const data = await adminService.getProducts(req.query);
    return successResponse(res, { message: 'Products retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateProductStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const data = await adminService.updateProductStatus(req.params.id, status, rejectionReason, req.user);
    return successResponse(res, { message: `Product status updated to ${status}`, data });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const data = await adminService.getCategories();
    return successResponse(res, { message: 'Categories retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const data = await adminService.createCategory(req.body, req.user);
    return successResponse(res, { statusCode: 201, message: 'Category created successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const data = await adminService.updateCategory(req.params.id, req.body, req.user);
    return successResponse(res, { message: 'Category updated successfully', data });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const data = await adminService.deleteCategory(req.params.id, req.user);
    return successResponse(res, { message: 'Category deleted successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const data = await adminService.getInventory(req.query);
    return successResponse(res, { message: 'Inventory fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { adjustment, reason } = req.body;
    const data = await adminService.adjustStock(req.params.id, adjustment, reason, req.user);
    return successResponse(res, { message: 'Stock adjusted successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const data = await adminService.getOrders(req.query);
    return successResponse(res, { message: 'Orders retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const data = await adminService.updateOrderStatus(req.params.id, status, note, req.user);
    return successResponse(res, { message: `Order status updated to ${status}`, data });
  } catch (err) {
    next(err);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const data = await adminService.getPayments(req.query);
    return successResponse(res, { message: 'Payments retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getRefunds = async (req, res, next) => {
  try {
    const data = await adminService.getRefunds(req.query);
    return successResponse(res, { message: 'Refunds retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateRefundDecision = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const data = await adminService.updateRefundDecision(req.params.id, status, rejectionReason, req.user);
    return successResponse(res, { message: `Refund decision recorded as ${status}`, data });
  } catch (err) {
    next(err);
  }
};

export const getDeliveries = async (req, res, next) => {
  try {
    const data = await adminService.getDeliveries();
    return successResponse(res, { message: 'Deliveries retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const assignDeliveryPartner = async (req, res, next) => {
  try {
    const data = await adminService.assignDeliveryPartner(req.body, req.user);
    return successResponse(res, { message: 'Delivery partner assigned successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const data = await adminService.getReviews();
    return successResponse(res, { message: 'Reviews retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const moderateReview = async (req, res, next) => {
  try {
    const { status, moderationNote } = req.body;
    const data = await adminService.moderateReview(req.params.id, status, moderationNote, req.user);
    return successResponse(res, { message: 'Review moderation updated', data });
  } catch (err) {
    next(err);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const data = await adminService.getCoupons();
    return successResponse(res, { message: 'Coupons retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const data = await adminService.createCoupon(req.body, req.user);
    return successResponse(res, { statusCode: 201, message: 'Coupon created successfully', data });
  } catch (err) {
    next(err);
  }
};

export const toggleCoupon = async (req, res, next) => {
  try {
    const data = await adminService.toggleCoupon(req.params.id, req.body.isActive, req.user);
    return successResponse(res, { message: 'Coupon updated successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getSupportTickets = async (req, res, next) => {
  try {
    const data = await adminService.getSupportTickets(req.query);
    return successResponse(res, { message: 'Support tickets retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const replySupportTicket = async (req, res, next) => {
  try {
    const data = await adminService.replySupportTicket(req.params.id, req.body.message, req.user);
    return successResponse(res, { message: 'Reply sent successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const data = await adminService.updateTicketStatus(req.params.id, req.body.status, req.user);
    return successResponse(res, { message: 'Ticket status updated', data });
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const data = await adminService.getNotifications();
    return successResponse(res, { message: 'Notifications retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const data = await adminService.sendNotification(req.body, req.user);
    return successResponse(res, { statusCode: 201, message: 'Notification broadcasted', data });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogs(req.query);
    return successResponse(res, { message: 'Audit logs retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const data = await adminService.getSettings();
    return successResponse(res, { message: 'Settings retrieved successfully', data });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const data = await adminService.updateSettings(req.body, req.user);
    return successResponse(res, { message: 'Settings updated successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const data = await adminService.getReportsData();
    return successResponse(res, { message: 'Reports generated successfully', data });
  } catch (err) {
    next(err);
  }
};

