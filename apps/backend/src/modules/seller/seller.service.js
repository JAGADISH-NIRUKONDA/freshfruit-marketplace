import mongoose from 'mongoose';
import { User } from '../auth/user.model.js';
import { Product } from '../admin/models/product.model.js';
import { Category } from '../admin/models/category.model.js';
import { FarmerProfile } from '../admin/models/farmerprofile.model.js';
import { Order } from '../admin/models/order.model.js';
import { AppError } from '../../utils/response.js';

/**
 * 1. Get or create Seller / Farmer Profile
 */
export const getSellerProfile = async (sellerUserId) => {
  const user = await User.findById(sellerUserId).lean();
  if (!user) {
    throw new AppError('Seller account not found', 404);
  }

  let profile = await FarmerProfile.findOne({ userId: sellerUserId }).lean();
  if (!profile) {
    // Automatically initialize default profile for new or existing seller without profile
    profile = await FarmerProfile.create({
      userId: sellerUserId,
      farmName: `${user.name}'s Organic Farm`,
      bio: 'Cultivating wholesome organic harvest with sustainable practices.',
      farmAddress: {
        city: 'Nashik',
        state: 'Maharashtra',
        country: 'India',
      },
      verificationStatus: 'approved',
      certifications: ['PGS-India Organic Certified'],
      rating: 5.0,
      totalReviews: 12,
    });
    profile = profile.toObject();
  }

  return {
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    profile,
  };
};

/**
 * 2. Update Seller / Farmer Profile
 */
export const updateSellerProfile = async (sellerUserId, data) => {
  const user = await User.findById(sellerUserId);
  if (!user) {
    throw new AppError('Seller account not found', 404);
  }

  if (data.name) user.name = data.name.trim();
  if (data.phone) user.phone = data.phone.trim();
  await user.save();

  let profile = await FarmerProfile.findOne({ userId: sellerUserId });
  if (!profile) {
    profile = new FarmerProfile({ userId: sellerUserId });
  }

  if (data.farmName !== undefined) profile.farmName = data.farmName.trim();
  if (data.bio !== undefined) profile.bio = data.bio.trim();
  if (data.phone !== undefined) profile.phone = data.phone.trim();
  if (data.certifications && Array.isArray(data.certifications)) {
    profile.certifications = data.certifications;
  }
  if (data.farmAddress && typeof data.farmAddress === 'object') {
    profile.farmAddress = {
      ...profile.farmAddress,
      ...data.farmAddress,
    };
  }

  await profile.save();

  return {
    user: {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    profile: profile.toObject(),
  };
};

/**
 * 3. Get Seller Dashboard Statistics
 */
export const getSellerStats = async (sellerUserId) => {
  const sellerObjId = new mongoose.Types.ObjectId(sellerUserId);

  const [
    totalProducts,
    activeProducts,
    pendingProducts,
    lowStockProducts,
    outOfStockProducts,
    inventoryAgg,
    profile,
  ] = await Promise.all([
    Product.countDocuments({ sellerId: sellerObjId }),
    Product.countDocuments({ sellerId: sellerObjId, status: 'active' }),
    Product.countDocuments({ sellerId: sellerObjId, status: 'pending_approval' }),
    Product.countDocuments({
      sellerId: sellerObjId,
      status: 'active',
      availableQuantity: { $gt: 0, $lte: 10 },
    }),
    Product.countDocuments({
      sellerId: sellerObjId,
      availableQuantity: { $lte: 0 },
    }),
    Product.aggregate([
      { $match: { sellerId: sellerObjId } },
      {
        $group: {
          _id: null,
          totalUnitsAvailable: { $sum: '$availableQuantity' },
          totalUnitsSold: { $sum: '$totalSold' },
        },
      },
    ]),
    FarmerProfile.findOne({ userId: sellerObjId }).lean(),
  ]);

  const unitsAvailable = inventoryAgg[0]?.totalUnitsAvailable || 0;
  const unitsSold = inventoryAgg[0]?.totalUnitsSold || 0;

  return {
    totalProducts,
    activeProducts,
    pendingProducts,
    lowStockProducts,
    outOfStockProducts,
    totalUnitsAvailable: unitsAvailable,
    totalUnitsSold: unitsSold,
    farmerRating: profile?.rating || 4.9,
    totalReviews: profile?.totalReviews || 0,
    verificationStatus: profile?.verificationStatus || 'approved',
    farmName: profile?.farmName || 'Verified Orchard',
  };
};

/**
 * 4. Get Seller's Products (Strict Ownership)
 */
export const getSellerProducts = async (sellerUserId, query = {}) => {
  const { category, search, status, sort = 'newest', page = 1, limit = 20 } = query;

  const filter = {
    sellerId: new mongoose.Types.ObjectId(sellerUserId),
  };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (category && category !== 'all') {
    const cat = await Category.findOne({
      $or: [
        { slug: category },
        { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null },
      ],
    });
    if (cat) {
      filter.categoryId = cat._id;
    }
  }

  if (search && search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'stock_asc') sortOption = { availableQuantity: 1 };
  if (sort === 'stock_desc') sortOption = { availableQuantity: -1 };
  if (sort === 'popular') sortOption = { totalSold: -1 };

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('categoryId', 'name slug image')
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const formatted = products.map((p) => ({
    id: p._id,
    _id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    discountPrice: p.discountPrice || p.price,
    unit: p.unit || 'kg',
    category: p.categoryId?.slug || 'fruits',
    categoryName: p.categoryId?.name || 'Produce',
    categoryId: p.categoryId?._id || p.categoryId,
    availableQuantity: p.availableQuantity,
    minOrderQuantity: p.minOrderQuantity || 1,
    grade: p.grade || 'A',
    isOrganic: p.isOrganic ?? true,
    status: p.status,
    rating: p.rating || 5.0,
    totalReviews: p.totalReviews || 0,
    totalSold: p.totalSold || 0,
    images: p.images || [],
    image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return {
    products: formatted,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit) || 1,
  };
};

/**
 * 5. Create Seller Product (Strict Ownership Attached)
 */
export const createSellerProduct = async (sellerUserId, data) => {
  if (!data.name || !data.name.trim()) {
    throw new AppError('Product name is required', 400);
  }
  if (!data.categoryId) {
    throw new AppError('Category ID is required', 400);
  }
  if (data.price === undefined || data.price < 0) {
    throw new AppError('Valid price is required', 400);
  }

  // Validate category exists
  const category = await Category.findById(data.categoryId);
  if (!category) {
    throw new AppError('Selected category does not exist', 404);
  }

  // Process images
  let images = [];
  if (Array.isArray(data.images) && data.images.length > 0) {
    images = data.images.map((img, idx) => ({
      url: typeof img === 'string' ? img : img.url,
      isPrimary: idx === 0,
    }));
  } else if (data.image) {
    images = [{ url: data.image, isPrimary: true }];
  } else {
    images = [
      {
        url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ];
  }

  const newProduct = await Product.create({
    name: data.name.trim(),
    description: data.description ? data.description.trim() : '',
    categoryId: category._id,
    sellerId: new mongoose.Types.ObjectId(sellerUserId),
    price: Number(data.price),
    discountPrice: data.discountPrice ? Number(data.discountPrice) : Number(data.price),
    unit: data.unit ? data.unit.trim() : 'kg',
    availableQuantity: data.availableQuantity !== undefined ? Math.max(0, Number(data.availableQuantity)) : 10,
    minOrderQuantity: data.minOrderQuantity ? Number(data.minOrderQuantity) : 1,
    grade: data.grade || 'A',
    isOrganic: data.isOrganic !== undefined ? Boolean(data.isOrganic) : true,
    status: data.status || 'active',
    images,
  });

  const populated = await Product.findById(newProduct._id)
    .populate('categoryId', 'name slug image')
    .lean();

  return {
    id: populated._id,
    _id: populated._id,
    name: populated.name,
    description: populated.description,
    price: populated.price,
    discountPrice: populated.discountPrice,
    unit: populated.unit,
    category: populated.categoryId?.slug,
    categoryName: populated.categoryId?.name,
    availableQuantity: populated.availableQuantity,
    grade: populated.grade,
    isOrganic: populated.isOrganic,
    status: populated.status,
    image: populated.images?.[0]?.url,
    images: populated.images,
  };
};

/**
 * 6. Get Single Product (Owner Only)
 */
export const getSellerProductById = async (sellerUserId, productId) => {
  const product = await Product.findById(productId)
    .populate('categoryId', 'name slug image')
    .lean();

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.sellerId.toString() !== sellerUserId.toString()) {
    throw new AppError('Access forbidden: You cannot view or manage another seller’s product', 403);
  }

  return {
    id: product._id,
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    discountPrice: product.discountPrice || product.price,
    unit: product.unit,
    categoryId: product.categoryId?._id,
    category: product.categoryId?.slug,
    categoryName: product.categoryId?.name,
    availableQuantity: product.availableQuantity,
    grade: product.grade,
    isOrganic: product.isOrganic,
    status: product.status,
    images: product.images,
    image: product.images?.[0]?.url,
  };
};

/**
 * 7. Update Seller Product (Strict Ownership Guard)
 */
export const updateSellerProduct = async (sellerUserId, productId, data) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.sellerId.toString() !== sellerUserId.toString()) {
    throw new AppError('Access forbidden: You cannot update another seller’s product', 403);
  }

  if (data.name !== undefined) product.name = data.name.trim();
  if (data.description !== undefined) product.description = data.description.trim();
  if (data.price !== undefined) product.price = Math.max(0, Number(data.price));
  if (data.discountPrice !== undefined) product.discountPrice = Math.max(0, Number(data.discountPrice));
  if (data.unit !== undefined) product.unit = data.unit.trim();
  if (data.availableQuantity !== undefined) {
    product.availableQuantity = Math.max(0, Number(data.availableQuantity));
  }
  if (data.grade !== undefined) product.grade = data.grade;
  if (data.isOrganic !== undefined) product.isOrganic = Boolean(data.isOrganic);
  if (data.status !== undefined) product.status = data.status;

  if (data.categoryId) {
    const cat = await Category.findById(data.categoryId);
    if (!cat) throw new AppError('Invalid category ID', 404);
    product.categoryId = cat._id;
  }

  if (Array.isArray(data.images) && data.images.length > 0) {
    product.images = data.images.map((img, idx) => ({
      url: typeof img === 'string' ? img : img.url,
      isPrimary: idx === 0,
    }));
  } else if (data.image) {
    product.images = [{ url: data.image, isPrimary: true }];
  }

  await product.save();

  const populated = await Product.findById(product._id)
    .populate('categoryId', 'name slug image')
    .lean();

  return {
    id: populated._id,
    _id: populated._id,
    name: populated.name,
    description: populated.description,
    price: populated.price,
    discountPrice: populated.discountPrice,
    unit: populated.unit,
    category: populated.categoryId?.slug,
    categoryName: populated.categoryId?.name,
    availableQuantity: populated.availableQuantity,
    grade: populated.grade,
    isOrganic: populated.isOrganic,
    status: populated.status,
    images: populated.images,
  };
};

/**
 * 8. Delete Seller Product (Strict Ownership Guard)
 */
export const deleteSellerProduct = async (sellerUserId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.sellerId.toString() !== sellerUserId.toString()) {
    throw new AppError('Access forbidden: You cannot delete another seller’s product', 403);
  }

  await Product.findByIdAndDelete(productId);

  return {
    id: productId,
    message: 'Product deleted from orchard catalog successfully',
  };
};

/**
 * 9. Quick Inventory / Stock Adjustment (Strict Ownership Guard)
 */
export const adjustSellerInventory = async (sellerUserId, productId, { availableQuantity, delta }) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.sellerId.toString() !== sellerUserId.toString()) {
    throw new AppError('Access forbidden: You cannot adjust another seller’s inventory', 403);
  }

  if (typeof availableQuantity === 'number') {
    product.availableQuantity = Math.max(0, availableQuantity);
  } else if (typeof delta === 'number') {
    product.availableQuantity = Math.max(0, product.availableQuantity + delta);
  } else {
    throw new AppError('Provide availableQuantity or delta to adjust stock', 400);
  }

  await product.save();

  return {
    id: product._id,
    _id: product._id,
    name: product.name,
    availableQuantity: product.availableQuantity,
    status: product.status,
  };
};

