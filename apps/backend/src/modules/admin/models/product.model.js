import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    unit: {
      type: String,
      default: 'kg',
      trim: true,
    },
    availableQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    harvestDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C'],
      default: 'A',
    },
    isOrganic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending_approval', 'rejected', 'suspended'],
      default: 'active',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    tags: [String],
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ status: 1, categoryId: 1, sellerId: 1 });

export const Product = mongoose.model('Product', productSchema, 'products');

