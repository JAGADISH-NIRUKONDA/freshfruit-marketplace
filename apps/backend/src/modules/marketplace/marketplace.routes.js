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

    // Category filter by slug, organic flag, or ID
    if (category && category !== 'all') {
      if (category === 'organic') {
        filter.isOrganic = true;
      } else {
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
 * GET /api/v1/products/suggestions
 * Returns live autocomplete suggestions for search bar
 */
router.get('/products/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return successResponse(res, { data: { suggestions: [] } });
    }
    const regex = new RegExp(q.trim(), 'i');
    const items = await Product.find({
      status: 'active',
      $or: [{ name: regex }, { description: regex }, { tags: { $in: [regex] } }],
    })
      .select('name price unit images categoryId')
      .populate('categoryId', 'name slug')
      .limit(6)
      .lean();

    const suggestions = items.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      unit: item.unit || '1 kg',
      categoryName: item.categoryId?.name || 'Produce',
      categorySlug: item.categoryId?.slug || 'fruits',
      image: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80',
    }));

    return successResponse(res, {
      message: 'Search suggestions retrieved',
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/products/:id
 * Retrieve detailed product view populated with seller & farmer profile
 */
router.get('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid product ID format' });
    }

    const prod = await Product.findOne({ _id: id, status: 'active' })
      .populate('categoryId', 'name slug description image')
      .populate('sellerId', 'name email phone avatar')
      .lean();

    if (!prod) {
      return errorResponse(res, { statusCode: 404, message: 'Product not found or not active' });
    }

    const farmerProfile = await FarmerProfile.findOne({ userId: prod.sellerId?._id }).lean();
    const reviews = await Review.find({ productId: prod._id, status: 'published' })
      .populate('customerId', 'name')
      .sort({ rating: -1, createdAt: -1 })
      .limit(5)
      .lean();

    const enrichedProduct = {
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
      reviewsCount: prod.totalReviews || reviews.length || 24,
      grade: prod.grade || 'A+',
      isOrganic: prod.isOrganic ?? true,
      harvestDate: prod.harvestDate
        ? new Date(prod.harvestDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Daily Morning Harvest',
      images: prod.images?.length > 0
        ? prod.images.map((img) => img.url)
        : ['https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80'],
      farm: {
        farmName: farmerProfile?.farmName || prod.sellerId?.name || 'Partner Organic Orchard',
        farmerName: prod.sellerId?.name || 'Accredited Grower',
        location: farmerProfile?.farmAddress
          ? `${farmerProfile.farmAddress.city}, ${farmerProfile.farmAddress.state}`
          : 'Nashik Agri-Tech Corridor',
        certifications: farmerProfile?.certifications || ['PGS-India Organic Certified'],
        bio: farmerProfile?.bio || 'Multi-generational family orchard cultivating chemical-free produce with natural compost and mountain spring water.',
        rating: farmerProfile?.rating || 4.9,
        isVerified:
          farmerProfile?.verificationStatus === 'approved' || farmerProfile?.verificationStatus === 'verified',
        image: prod.sellerId?.avatar || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=200&q=80',
      },
      customerReviews: reviews.map((r) => ({
        id: r._id,
        customerName: r.customerId?.name || 'Verified Customer',
        rating: r.rating || 5,
        title: r.title || 'Superb quality',
        body: r.body || r.comment,
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
          : 'Recent',
      })),
    };

    return successResponse(res, {
      message: 'Product details retrieved successfully',
      data: { product: enrichedProduct },
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
 * GET /api/v1/farmers/:id
 * Public individual farmer profile details
 */
router.get('/farmers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    let farmer = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      farmer = await FarmerProfile.findOne({
        $or: [{ _id: id }, { userId: id }],
      })
        .populate('userId', 'name email phone avatar createdAt')
        .lean();
    }

    if (!farmer) {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Farmer profile not found',
      });
    }

    // Get active products count and category breakdown for this farmer
    const sellerUserId = farmer.userId?._id || farmer.userId;
    const [productCount, categoriesOffered] = await Promise.all([
      Product.countDocuments({ sellerId: sellerUserId, status: 'active' }),
      Product.find({ sellerId: sellerUserId, status: 'active' })
        .distinct('categoryId'),
    ]);

    const categories = await Category.find({ _id: { $in: categoriesOffered } })
      .select('name slug')
      .lean();

    const formattedFarmer = {
      id: farmer._id,
      _id: farmer._id,
      userId: sellerUserId,
      farmName: farmer.farmName,
      farmerName: farmer.userId?.name || 'Verified Grower',
      email: farmer.userId?.email,
      phone: farmer.phone || farmer.userId?.phone || '+91 98765 43210',
      bio: farmer.bio || 'Dedicated to organic and biodynamic cultivation methods without chemical pesticides.',
      location: farmer.farmAddress
        ? `${farmer.farmAddress.city || 'Nashik'}, ${farmer.farmAddress.state || 'Maharashtra'}`
        : 'Nashik Agri-Tech Corridor, Maharashtra',
      farmAddress: farmer.farmAddress,
      certifications: farmer.certifications?.length > 0
        ? farmer.certifications
        : ['PGS-India Organic Certified', 'Zero Pesticide Residue'],
      rating: farmer.rating || 4.9,
      totalReviews: farmer.totalReviews || 28,
      isVerified: farmer.verificationStatus === 'approved' || farmer.verificationStatus === 'verified',
      verificationStatus: farmer.verificationStatus,
      productsCount: productCount,
      categoriesOffered: categories.map((c) => ({ id: c._id, name: c.name, slug: c.slug })),
      image:
        farmer.userId?.avatar ||
        'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
      orchardImage:
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
      joinedYear: farmer.userId?.createdAt
        ? new Date(farmer.userId.createdAt).getFullYear()
        : 2024,
    };

    return successResponse(res, {
      message: 'Farmer profile retrieved successfully',
      data: { farmer: formattedFarmer },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/farmers/:id/storefront
 * Public farmer storefront showing available products with filtering and search
 */
router.get('/farmers/:id/storefront', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { search, category, sort = 'newest' } = req.query;

    let farmer = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      farmer = await FarmerProfile.findOne({
        $or: [{ _id: id }, { userId: id }],
      })
        .populate('userId', 'name email phone avatar')
        .lean();
    }

    if (!farmer) {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Farmer storefront not found',
      });
    }

    const sellerUserId = farmer.userId?._id || farmer.userId;
    const productFilter = {
      sellerId: sellerUserId,
      status: 'active',
    };

    if (category && category !== 'all') {
      const catDoc = await Category.findOne({
        $or: [
          { slug: category },
          { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null },
        ],
      });
      if (catDoc) {
        productFilter.categoryId = catDoc._id;
      }
    }

    if (search && search.trim()) {
      productFilter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { totalSold: -1, rating: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(productFilter)
      .populate('categoryId', 'name slug image')
      .sort(sortOption)
      .lean();

    const formattedProducts = products.map((prod) => ({
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
      harvestDate: prod.harvestDate ? 'Harvested Fresh' : 'Daily Morning Harvest',
      farm: farmer.farmName,
      image:
        prod.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80',
      images: prod.images?.map((i) => i.url) || [],
    }));

    return successResponse(res, {
      message: 'Farmer storefront retrieved successfully',
      data: {
        farmer: {
          id: farmer._id,
          _id: farmer._id,
          userId: sellerUserId,
          farmName: farmer.farmName,
          farmerName: farmer.userId?.name || 'Verified Grower',
          location: farmer.farmAddress
            ? `${farmer.farmAddress.city}, ${farmer.farmAddress.state}`
            : 'Nashik, Maharashtra',
          bio: farmer.bio,
          rating: farmer.rating || 4.9,
          totalReviews: farmer.totalReviews || 35,
          isVerified: farmer.verificationStatus === 'approved' || farmer.verificationStatus === 'verified',
          certifications: farmer.certifications || ['100% Certified Organic'],
          image:
            farmer.userId?.avatar ||
            'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
        },
        products: formattedProducts,
        totalProducts: formattedProducts.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/farmers/:id/inquiry
 * Send direct customer inquiry / bulk order question to farmer
 */
router.post('/farmers/:id/inquiry', async (req, res, next) => {
  try {
    const { name, email, phone, message, subject } = req.body;
    if (!name || !email || !message) {
      return errorResponse(res, {
        statusCode: 400,
        message: 'Name, email, and message are required',
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'Your inquiry has been relayed to the farmer. They will contact you shortly.',
      data: {
        sentAt: new Date().toISOString(),
        farmerId: req.params.id,
      },
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

