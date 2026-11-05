import mongoose from 'mongoose';

const deliveryAssignmentSchema = new mongoose.Schema(
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
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    partnerName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['assigned', 'picked_up', 'in_transit', 'delivered', 'delayed', 'failed'],
      default: 'assigned',
    },
    pickupLocation: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    dropLocation: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: Date,
    estimatedDeliveryTime: Date,
    isDelayed: {
      type: Boolean,
      default: false,
    },
    delayReason: {
      type: String,
      default: '',
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      lastUpdated: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const DeliveryAssignment = mongoose.model(
  'DeliveryAssignment',
  deliveryAssignmentSchema,
  'delivery_assignments'
);

