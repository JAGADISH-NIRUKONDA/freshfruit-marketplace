import mongoose from 'mongoose';

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      required: true,
    },
    comment: String,
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['published', 'under_review', 'flagged', 'hidden'],
      default: 'published',
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moderationNote: String,
  },
  {
    timestamps: true,
  }
);
export const Review = mongoose.model('Review', reviewSchema, 'reviews');

// Coupon Schema
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'fixed',
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startsAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);
export const Coupon = mongoose.model('Coupon', couponSchema, 'coupons');

// Support Ticket Schema
const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['order', 'payment', 'delivery', 'product', 'seller', 'other'],
      default: 'order',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedAgentName: String,
    messages: [
      {
        senderId: mongoose.Schema.Types.ObjectId,
        senderRole: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    internalNotes: [
      {
        authorId: mongoose.Schema.Types.ObjectId,
        authorName: String,
        note: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);
export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema, 'supporttickets');

// Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['system', 'order', 'promotion', 'alert'],
      default: 'system',
    },
    targetRole: {
      type: String,
      enum: ['all', 'customer', 'seller', 'delivery_partner', 'admin'],
      default: 'all',
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: String,
  },
  {
    timestamps: true,
  }
);
export const Notification = mongoose.model('Notification', notificationSchema, 'notifications');

// Audit Log Schema
const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: String,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema, 'auditlogs');

// Platform Settings Schema
const platformSettingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: 'FreshFruit Market',
    },
    logo: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '+91 98000 00000',
    },
    supportEmail: {
      type: String,
      default: 'support@freshfruit.market',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 40,
    },
    minOrderAmount: {
      type: Number,
      default: 199,
    },
    sellerCommissionRate: {
      type: Number,
      default: 5,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    notificationEmail: {
      type: String,
      default: 'alerts@freshfruit.market',
    },
  },
  {
    timestamps: true,
  }
);
export const PlatformSettings = mongoose.model(
  'PlatformSettings',
  platformSettingsSchema,
  'platform_settings'
);
