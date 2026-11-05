import mongoose from 'mongoose';
import { User } from '../auth/user.model.js';
import { Category } from './models/category.model.js';
import { Product } from './models/product.model.js';
import { FarmerProfile } from './models/farmerprofile.model.js';
import { Order } from './models/order.model.js';
import { Payment, Refund } from './models/payment.model.js';
import { DeliveryAssignment } from './models/delivery.model.js';
import {
  Review,
  Coupon,
  SupportTicket,
  Notification,
  AuditLog,
  PlatformSettings,
} from './models/platform.model.js';
import { AppError } from '../../utils/response.js';

// Helper to log audit actions
export const logAudit = async ({ adminId, adminEmail, action, entityType, entityId, details }) => {
  try {
    await AuditLog.create({
      adminId,
      adminEmail,
      action,
      entityType,
      entityId: entityId ? entityId.toString() : '',
      details,
    });
  } catch (err) {
    console.error('[AuditLog Error]', err.message);
  }
};

// 1. Dashboard Overview KPIs & Widgets
export const getDashboardOverview = async () => {
  const [
    totalCustomers,
    totalSellers,
    totalDeliveryPartners,
    totalProducts,
    totalOrders,
    revenueAgg,
    pendingSellerApprovals,
    pendingProductApprovals,
    pendingRefunds,
    activeDeliveries,
    lowStockProducts,
    totalSupportTickets,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ role: 'delivery_partner' }),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]),
    FarmerProfile.countDocuments({ verificationStatus: { $in: ['pending', 'under_review'] } }),
    Product.countDocuments({ status: 'pending_approval' }),
    Refund.countDocuments({ status: 'pending' }),
    DeliveryAssignment.countDocuments({ status: { $in: ['assigned', 'picked_up', 'in_transit'] } }),
    Product.countDocuments({ availableQuantity: { $lte: 10 } }),
    SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // Recent widgets
  const [recentOrders, recentCustomers, recentSellers, lowStockAlerts, pendingApprovals, delayedDeliveries, recentTickets] =
    await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(6).lean(),
      User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(5).lean(),
      FarmerProfile.find({ verificationStatus: { $in: ['pending', 'under_review'] } })
        .populate('userId', 'name email phone')
        .limit(5)
        .lean(),
      Product.find({ availableQuantity: { $lte: 10 } })
        .populate('categoryId', 'name')
        .populate('sellerId', 'name')
        .limit(6)
        .lean(),
      Product.find({ status: 'pending_approval' })
        .populate('categoryId', 'name')
        .populate('sellerId', 'name')
        .limit(5)
        .lean(),
      DeliveryAssignment.find({ $or: [{ isDelayed: true }, { status: 'delayed' }] })
        .limit(5)
        .lean(),
      SupportTicket.find({ status: { $in: ['open', 'in_progress'] } })
        .sort({ priority: -1, createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  return {
    kpis: {
      totalCustomers,
      totalSellers,
      totalDeliveryPartners,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingSellerApprovals,
      pendingProductApprovals,
      pendingRefunds,
      activeDeliveries,
      lowStockProducts,
      totalSupportTickets,
    },
    recentOrders,
    recentCustomers,
    recentSellers,
    lowStockAlerts,
    pendingApprovals,
    delayedDeliveries,
    recentTickets,
  };
};

// 2. Business Analytics & Charts
export const getAnalyticsData = async (period = '30d') => {
  const daysMap = { today: 1, '7d': 7, '30d': 30, '90d': 90, year: 365 };
  const days = daysMap[period] || 30;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Daily revenue & orders
  const dailyMetrics = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] },
        },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Orders by Status
  const ordersByStatus = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Category wise sales
  const categorySales = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $lookup: {
        from: 'categories',
        localField: 'product.categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category.name',
        sales: { $sum: '$items.subtotal' },
        quantitySold: { $sum: '$items.quantity' },
      },
    },
    { $sort: { sales: -1 } },
  ]);

  // Payment Methods
  const paymentDistribution = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
  ]);

  return {
    period,
    dailyMetrics: dailyMetrics.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
    ordersByStatus: ordersByStatus.map((s) => ({ status: s._id, count: s.count })),
    categorySales: categorySales.map((c) => ({ category: c._id, sales: c.sales, quantity: c.quantitySold })),
    paymentDistribution: paymentDistribution.map((p) => ({ method: p._id, count: p.count, total: p.total })),
  };
};

// 3. User Management
export const getUsers = async ({ role, search, status, page = 1, limit = 15 }) => {
  const query = {};
  if (role && role !== 'all') query.role = role;
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateUserStatus = async (userId, isActive, adminUser) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  user.isActive = isActive;
  await user.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
    entityType: 'USER',
    entityId: userId,
    details: { email: user.email, role: user.role, isActive },
  });

  return user.toJSON();
};

export const updateUserRole = async (userId, newRole, adminUser) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const prevRole = user.role;
  user.role = newRole;
  await user.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'CHANGE_USER_ROLE',
    entityType: 'USER',
    entityId: userId,
    details: { email: user.email, previousRole: prevRole, newRole },
  });

  return user.toJSON();
};

// 4. Seller & Farmer Management
export const getSellers = async ({ status, search, page = 1, limit = 15 }) => {
  const query = {};
  if (status && status !== 'all') query.verificationStatus = status;
  if (search) {
    query.$or = [
      { farmName: { $regex: search, $options: 'i' } },
      { 'farmAddress.city': { $regex: search, $options: 'i' } },
      { 'farmAddress.state': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [farmers, total] = await Promise.all([
    FarmerProfile.find(query)
      .populate('userId', 'name email phone isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    FarmerProfile.countDocuments(query),
  ]);

  return {
    sellers: farmers,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateSellerVerification = async (farmerId, status, rejectionReason = '', adminUser) => {
  const profile = await FarmerProfile.findById(farmerId);
  if (!profile) throw new AppError('Farmer profile not found', 404);

  profile.verificationStatus = status;
  if (rejectionReason) profile.rejectionReason = rejectionReason;
  await profile.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: `SELLER_VERIFICATION_${status.toUpperCase()}`,
    entityType: 'FARMER_PROFILE',
    entityId: farmerId,
    details: { farmName: profile.farmName, verificationStatus: status, rejectionReason },
  });

  return profile;
};

// 5. Product Management
export const getProducts = async ({ category, status, grade, search, page = 1, limit = 15 }) => {
  const query = {};
  if (category && category !== 'all') query.categoryId = category;
  if (status && status !== 'all') query.status = status;
  if (grade && grade !== 'all') query.grade = grade;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateProductStatus = async (productId, status, rejectionReason = '', adminUser) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  product.status = status;
  if (rejectionReason) product.rejectionReason = rejectionReason;
  await product.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: `PRODUCT_STATUS_${status.toUpperCase()}`,
    entityType: 'PRODUCT',
    entityId: productId,
    details: { productName: product.name, status, rejectionReason },
  });

  return product;
};

// 6. Category Management
export const getCategories = async () => {
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ categoryId: cat._id });
      return { ...cat, productCount };
    })
  );
  return withCounts;
};

export const createCategory = async (data, adminUser) => {
  const existing = await Category.findOne({ slug: data.slug });
  if (existing) throw new AppError('Category slug already exists', 409);

  const category = await Category.create(data);
  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'CREATE_CATEGORY',
    entityType: 'CATEGORY',
    entityId: category._id,
    details: { name: category.name, slug: category.slug },
  });
  return category;
};

export const updateCategory = async (id, data, adminUser) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!category) throw new AppError('Category not found', 404);

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'UPDATE_CATEGORY',
    entityType: 'CATEGORY',
    entityId: id,
    details: data,
  });
  return category;
};

export const deleteCategory = async (id, adminUser) => {
  const productsCount = await Product.countDocuments({ categoryId: id });
  if (productsCount > 0) {
    throw new AppError(`Cannot delete category with ${productsCount} active products. Reassign products first.`, 400);
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError('Category not found', 404);

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'DELETE_CATEGORY',
    entityType: 'CATEGORY',
    entityId: id,
    details: { name: category.name },
  });
  return category;
};

// 7. Inventory Management
export const getInventory = async ({ search, lowStockOnly }) => {
  const query = {};
  if (lowStockOnly === 'true') {
    query.availableQuantity = { $lte: 10 };
  }
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(query)
    .populate('categoryId', 'name')
    .populate('sellerId', 'name')
    .sort({ availableQuantity: 1 })
    .lean();

  const totalStockUnits = products.reduce((sum, p) => sum + (p.availableQuantity || 0), 0);
  const totalReservedUnits = products.reduce((sum, p) => sum + (p.reservedQuantity || 0), 0);
  const outOfStockCount = products.filter((p) => (p.availableQuantity || 0) === 0).length;
  const lowStockCount = products.filter((p) => (p.availableQuantity || 0) > 0 && p.availableQuantity <= 10).length;

  return {
    summary: { totalStockUnits, totalReservedUnits, outOfStockCount, lowStockCount },
    inventory: products,
  };
};

export const adjustStock = async (productId, adjustment, reason = '', adminUser) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const prevStock = product.availableQuantity;
  const newStock = prevStock + Number(adjustment);
  if (newStock < 0) throw new AppError('Stock cannot be reduced below zero', 400);

  product.availableQuantity = newStock;
  await product.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'ADJUST_INVENTORY_STOCK',
    entityType: 'PRODUCT',
    entityId: productId,
    details: { productName: product.name, prevStock, adjustment, newStock, reason },
  });

  return product;
};

// 8. Order Management
export const getOrders = async ({ status, paymentStatus, search, page = 1, limit = 15 }) => {
  const query = {};
  if (status && status !== 'all') query.status = status;
  if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus;
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'deliveryAddress.recipientName': { $regex: search, $options: 'i' } },
      { 'deliveryAddress.city': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateOrderStatus = async (orderId, newStatus, note = '', adminUser) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  const validTransitions = [
    'pending_payment',
    'paid',
    'pending',
    'processing',
    'accepted',
    'dispatched',
    'in_transit',
    'delivered',
    'cancelled',
    'returned',
  ];
  if (!validTransitions.includes(newStatus)) {
    throw new AppError('Invalid order status transition', 400);
  }

  const prevStatus = order.status;
  order.status = newStatus;
  order.events.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status updated by Admin ${adminUser.email}`,
  });
  await order.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'UPDATE_ORDER_STATUS',
    entityType: 'ORDER',
    entityId: orderId,
    details: { orderNumber: order.orderNumber, prevStatus, newStatus, note },
  });

  return order;
};

// 9. Payments & Refunds
export const getPayments = async ({ method, status, page = 1, limit = 20 }) => {
  const query = {};
  if (method && method !== 'all') query.method = method;
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(query),
  ]);

  return { payments, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) } };
};

export const getRefunds = async ({ status, page = 1, limit = 20 }) => {
  const query = {};
  if (status && status !== 'all') query.status = status;

  const skip = (page - 1) * limit;
  const [refunds, total] = await Promise.all([
    Refund.find(query)
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Refund.countDocuments(query),
  ]);

  return { refunds, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) } };
};

export const updateRefundDecision = async (refundId, status, rejectionReason = '', adminUser) => {
  const refund = await Refund.findById(refundId);
  if (!refund) throw new AppError('Refund record not found', 404);

  refund.status = status;
  if (rejectionReason) refund.rejectionReason = rejectionReason;
  if (status === 'approved' || status === 'processed') {
    refund.approvedBy = adminUser._id;
    refund.processedAt = new Date();
  }
  await refund.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: `REFUND_${status.toUpperCase()}`,
    entityType: 'REFUND',
    entityId: refundId,
    details: { orderNumber: refund.orderNumber, amount: refund.amount, status, rejectionReason },
  });

  return refund;
};

// 10. Delivery Management
export const getDeliveries = async () => {
  const [assignments, partners] = await Promise.all([
    DeliveryAssignment.find().sort({ createdAt: -1 }).lean(),
    User.find({ role: 'delivery_partner', isActive: true }).select('name email phone').lean(),
  ]);

  return { assignments, partners };
};

export const assignDeliveryPartner = async ({ orderId, partnerId }, adminUser) => {
  const [order, partner] = await Promise.all([Order.findById(orderId), User.findById(partnerId)]);
  if (!order) throw new AppError('Order not found', 404);
  if (!partner) throw new AppError('Delivery partner not found', 404);

  const assignment = await DeliveryAssignment.create({
    orderId: order._id,
    orderNumber: order.orderNumber,
    partnerId: partner._id,
    partnerName: partner.name,
    status: 'assigned',
    pickupLocation: { street: 'Main Agricultural Transit Hub', city: 'Nashik', state: 'Maharashtra' },
    dropLocation: order.deliveryAddress,
    assignedAt: new Date(),
  });

  order.status = 'dispatched';
  await order.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'ASSIGN_DELIVERY_PARTNER',
    entityType: 'DELIVERY',
    entityId: assignment._id,
    details: { orderNumber: order.orderNumber, partnerName: partner.name },
  });

  return assignment;
};

// 11. Customer Engagement: Reviews, Coupons, Support, Notifications
export const getReviews = async () => {
  return Review.find()
    .populate('customerId', 'name email')
    .populate('productId', 'name')
    .sort({ createdAt: -1 })
    .lean();
};

export const moderateReview = async (reviewId, status, moderationNote = '', adminUser) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new AppError('Review not found', 404);

  review.status = status;
  review.isVisible = status === 'published';
  review.moderatedBy = adminUser._id;
  review.moderationNote = moderationNote;
  await review.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: `MODERATE_REVIEW_${status.toUpperCase()}`,
    entityType: 'REVIEW',
    entityId: reviewId,
    details: { status, moderationNote },
  });

  return review;
};

export const getCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 }).lean();
};

export const createCoupon = async (data, adminUser) => {
  const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (existing) throw new AppError('Coupon code already exists', 409);

  const coupon = await Coupon.create({
    ...data,
    code: data.code.toUpperCase(),
    createdBy: adminUser._id,
  });

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'CREATE_COUPON',
    entityType: 'COUPON',
    entityId: coupon._id,
    details: { code: coupon.code, value: coupon.value },
  });

  return coupon;
};

export const toggleCoupon = async (id, isActive, adminUser) => {
  const coupon = await Coupon.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!coupon) throw new AppError('Coupon not found', 404);

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'TOGGLE_COUPON',
    entityType: 'COUPON',
    entityId: id,
    details: { code: coupon.code, isActive },
  });

  return coupon;
};

export const getSupportTickets = async ({ status, priority }) => {
  const query = {};
  if (status && status !== 'all') query.status = status;
  if (priority && priority !== 'all') query.priority = priority;

  return SupportTicket.find(query)
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 })
    .lean();
};

export const replySupportTicket = async (ticketId, message, adminUser) => {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw new AppError('Support ticket not found', 404);

  ticket.messages.push({
    senderId: adminUser._id,
    senderRole: 'admin',
    message,
    timestamp: new Date(),
  });
  if (ticket.status === 'open') ticket.status = 'in_progress';
  await ticket.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'REPLY_SUPPORT_TICKET',
    entityType: 'SUPPORT_TICKET',
    entityId: ticketId,
    details: { ticketNumber: ticket.ticketNumber, message },
  });

  return ticket;
};

export const updateTicketStatus = async (ticketId, status, adminUser) => {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw new AppError('Support ticket not found', 404);

  ticket.status = status;
  if (status === 'resolved' || status === 'closed') ticket.resolvedAt = new Date();
  await ticket.save();

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'UPDATE_TICKET_STATUS',
    entityType: 'SUPPORT_TICKET',
    entityId: ticketId,
    details: { ticketNumber: ticket.ticketNumber, status },
  });

  return ticket;
};

export const getNotifications = async () => {
  return Notification.find().sort({ createdAt: -1 }).limit(50).lean();
};

export const sendNotification = async (data, adminUser) => {
  const notification = await Notification.create(data);

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'BROADCAST_NOTIFICATION',
    entityType: 'NOTIFICATION',
    entityId: notification._id,
    details: { title: notification.title, targetRole: notification.targetRole },
  });

  return notification;
};

// 12. System: Audit Logs & Platform Settings
export const getAuditLogs = async ({ page = 1, limit = 25 }) => {
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(),
  ]);

  return { logs, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) } };
};

export const getSettings = async () => {
  let settings = await PlatformSettings.findOne().lean();
  if (!settings) {
    settings = await PlatformSettings.create({});
  }
  return settings;
};

export const updateSettings = async (data, adminUser) => {
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = await PlatformSettings.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }

  await logAudit({
    adminId: adminUser._id,
    adminEmail: adminUser.email,
    action: 'UPDATE_PLATFORM_SETTINGS',
    entityType: 'SETTINGS',
    entityId: 'PLATFORM',
    details: data,
  });

  return settings;
};

// 13. Reports Export
export const getReportsData = async () => {
  const [orders, products, users] = await Promise.all([
    Order.find().lean(),
    Product.find().populate('categoryId', 'name').lean(),
    User.find().select('-passwordHash').lean(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalOrders: orders.length,
      grossSales: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      netRevenue: orders.filter((o) => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      totalProducts: products.length,
      totalUsers: users.length,
    },
    orders,
    products,
  };
};

