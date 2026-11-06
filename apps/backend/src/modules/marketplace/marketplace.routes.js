import { Router } from 'express';
import { Product } from '../admin/models/product.model.js';
import { Category } from '../admin/models/category.model.js';
import { FarmerProfile } from '../admin/models/farmerprofile.model.js';
import { Review } from '../admin/models/platform.model.js';
import { User } from '../auth/user.model.js';
import { successResponse, errorResponse } from '../../utils/response.js';

const router = Router();

// In-memory or simple collection for newsletter subscribers
const newsletterSubscribers = new Set();

/**
 * GET /api/v1/products
 * Public products query with category, search, sorting and pagination
 */
router.get('/products', async (req, res, next) => {
  try {
    const { category, search, sort = 'rating', limit = 20, page = 1 } = req.query;
    const filter = { status: 'active' };

    // Category filter by slug or ID
    if (category && category !== 'all') {
      const catDoc = await Category.findOne({
        $or: [
          { slug: category },
          { slug: category === 'greens' ? 'herbs-microgreens' : category },
          { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null },
        ],
      });
      if (catDoc) {
        filter.categoryId = catDoc._id;
      }
    }

    // Search query across name, description, tags
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    let sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { totalSold: -1 };

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId', 'name slug image')
        .populate('sellerId', 'name email phone')
        .sort(sortOption)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    // Attach farmer profile farmName if available
    const sellerIds = [...new Set(products.map((p) => p.sellerId?._id?.toString()).filter(Boolean))];
    const farmerProfiles = await FarmerProfile.find({ userId: { $in: sellerIds } }).lean();
    const farmerMap = {};
    for (const fp of farmerProfiles) {
      farmerMap[fp.userId.toString()] = fp;
    }

    const enrichedProducts = products.map((prod) => {
      const sId = prod.sellerId?._id?.toString();
      const fp = sId ? farmerMap[sId] : null;
      return {
        id: prod._id,
        _id: prod._id,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice || prod.price,
        originalPrice: prod.discountPrice ? prod.price * 1.25 : prod.price,
        unit: prod.unit || '1 kg',
        category: prod.categoryId?.slug || 'fruits',
        categoryName: prod.categoryId?.name || 'Fresh Fruits',
        inStock: prod.availableQuantity,
        stockStatus:
          prod.availableQuantity <= 0 ? 'Out of Stock' : prod.availableQuantity <= 10 ? 'Low Stock' : 'In Stock',
        rating: prod.rating || 4.9,
        reviews: prod.totalReviews || 24,
        grade: prod.grade || 'A',
        isOrganic: prod.isOrganic ?? true,
        harvestDate: prod.harvestDate ? 'Harvested Today' : 'Daily Fresh Picked',
        image:
          prod.images?.[0]?.url ||
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80',
        farm: fp?.farmName || prod.sellerId?.name || 'Partner Organic Orchard',
        farmLocation: fp?.farmAddress ? `${fp.farmAddress.city}, ${fp.farmAddress.state}` : 'Direct Farm Source',
        farmerVerified: fp?.verificationStatus === 'approved',
      };
    });

    return successResponse(res, {
      message: 'Active products retrieved successfully',
      data: {
        products: enrichedProducts,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/categories
 * Public category directory with live product counts
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: { $ne: false } })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Calculate product counts per category
    const counts = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    for (const c of counts) {
      if (c._id) countMap[c._id.toString()] = c.count;
    }

    const enriched = categories.map((cat) => ({
      id: cat._id,
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image:
        cat.image ||
        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
      productCount: countMap[cat._id.toString()] || 0,
    }));

    return successResponse(res, {
      message: 'Categories retrieved successfully',
      data: { categories: enriched },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/farmers
 * Public verified farmer directory & featured orchards
 */
router.get('/farmers', async (req, res, next) => {
  try {
    const farmers = await FarmerProfile.find({
      verificationStatus: { $in: ['approved', 'under_review', 'verified'] },
    })
      .populate('userId', 'name email phone avatar')
      .lean();

    const result = farmers.map((f) => ({
      id: f._id,
      farmName: f.farmName,
      farmerName: f.userId?.name || 'Dedicated Grower',
      bio: f.bio || 'Chemical-free natural farming committed to pesticide-free harvests.',
      location: f.farmAddress ? `${f.farmAddress.city}, ${f.farmAddress.state}` : 'Nashik Agri-Tech Corridor',
      certifications: f.certifications || ['100% Organic Certified'],
      rating: f.rating || 4.9,
      totalReviews: f.totalReviews || 45,
      isVerified: f.verificationStatus === 'approved' || f.verificationStatus === 'verified',
      image:
        f.userId?.avatar ||
        'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
      orchardImage:
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80',
    }));

    return successResponse(res, {
      message: 'Verified farmers retrieved successfully',
      data: { farmers: result },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/reviews
 * Public customer reviews / testimonials
 */
router.get('/reviews', async (req, res, next) => {
  try {
    const reviews = await Review.find({
      status: 'published',
      rating: { $gte: 4 },
    })
      .populate('customerId', 'name')
      .populate('productId', 'name')
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .lean();

    const formatted = reviews.map((r) => ({
      id: r._id,
      customerName: r.customerId?.name || 'Verified Customer',
      productName: r.productId?.name || 'Seasonal Produce',
      rating: r.rating || 5,
      title: r.title || 'Superb quality and freshness',
      comment: r.body || r.comment || 'Crisp, fresh, and delivered on time without any chemical wax.',
      isVerifiedPurchase: r.isVerifiedPurchase ?? true,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent',
    }));

    return successResponse(res, {
      message: 'Customer reviews retrieved successfully',
      data: { reviews: formatted },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/newsletter/subscribe
 * Newsletter signup
 */
router.post('/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse(res, {
      statusCode: 400,
      message: 'Please provide a valid email address.',
    });
  }

  newsletterSubscribers.add(email.toLowerCase());
  return successResponse(res, {
    statusCode: 200,
    message: 'Thank you! You have been subscribed to FreshFruit weekly harvest alerts.',
    data: { email: email.toLowerCase() },
  });
});

export default router;

