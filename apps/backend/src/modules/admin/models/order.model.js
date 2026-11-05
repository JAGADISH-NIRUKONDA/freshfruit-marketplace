import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: 'kg',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deliveryAddressId: mongoose.Schema.Types.ObjectId,
    deliveryAddress: {
      recipientName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionRate: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: [
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
      ],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    events: [orderEventSchema],
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ orderNumber: 1, customerId: 1, status: 1 });

export const Order = mongoose.model('Order', orderSchema, 'orders');

