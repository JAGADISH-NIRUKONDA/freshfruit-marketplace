import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String,
      enum: ['razorpay', 'cod'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'captured', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    capturedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model('Payment', paymentSchema, 'payments');

const refundSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Refund = mongoose.model('Refund', refundSchema, 'refunds');

