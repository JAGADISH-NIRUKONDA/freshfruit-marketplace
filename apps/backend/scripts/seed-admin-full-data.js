import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../src/config/database.js';
import { User } from '../src/modules/auth/user.model.js';
import { Category } from '../src/modules/admin/models/category.model.js';
import { Product } from '../src/modules/admin/models/product.model.js';
import { FarmerProfile } from '../src/modules/admin/models/farmerprofile.model.js';
import { Order } from '../src/modules/admin/models/order.model.js';
import { Payment, Refund } from '../src/modules/admin/models/payment.model.js';
import { DeliveryAssignment } from '../src/modules/admin/models/delivery.model.js';
import {
  Review,
  Coupon,
  SupportTicket,
  Notification,
  AuditLog,
  PlatformSettings,
} from '../src/modules/admin/models/platform.model.js';

export const seedAdminData = async () => {
  console.log('='.repeat(60));
  console.log('Seeding Comprehensive FreshFruit Market Admin Dataset');
  console.log('='.repeat(60));

  await connectDB();

  const demoPassword = 'DemoPass123!';
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  // 1. Ensure Core Users
  const userSeeds = [
    { email: 'admin@freshfruit.demo', name: 'Executive Admin', role: 'admin', phone: '+91 98000 00001' },
    { email: 'seller@freshfruit.demo', name: 'Rajesh Sharma Orchards', role: 'seller', phone: '+91 98000 00002' },
    { email: 'customer@freshfruit.demo', name: 'Ananya Deshmukh', role: 'customer', phone: '+91 98000 00003' },
    { email: 'delivery@freshfruit.demo', name: 'Suresh Express Fleet', role: 'delivery_partner', phone: '+91 98000 00004' },
    { email: 'support@freshfruit.demo', name: 'Priya Customer Care', role: 'support_agent', phone: '+91 98000 00005' },
    { email: 'vikram.farm@freshfruit.demo', name: 'Vikram Godavari Bio-Vines', role: 'seller', phone: '+91 98000 00012' },
    { email: 'sunita.citrus@freshfruit.demo', name: 'Sunita Vidarbha Groves', role: 'seller', phone: '+91 98000 00013' },
    { email: 'karan.buyer@freshfruit.demo', name: 'Karan Mehra', role: 'customer', phone: '+91 98000 00014' },
    { email: 'rohit.delivery@freshfruit.demo', name: 'Rohit Speed Logistics', role: 'delivery_partner', phone: '+91 98000 00015' },
  ];

  const userMap = {};
  for (const u of userSeeds) {
    let userDoc = await User.findOne({ email: u.email });
    if (!userDoc) {
      userDoc = await User.create({
        ...u,
        passwordHash,
        isVerified: true,
        isActive: true,
      });
    } else {
      userDoc.role = u.role;
      userDoc.passwordHash = passwordHash;
      await userDoc.save();
    }
    userMap[u.email] = userDoc;
  }

  // 2. Ensure Farmer Profiles
  const farmerSeeds = [
    {
      userId: userMap['seller@freshfruit.demo']._id,
      farmName: 'Sharma Alpine Orchards',
      bio: 'High-altitude chemical-free Apple & Cherry groves in Shimla Hills.',
      farmAddress: { street: 'Shimla Valley Route 4', city: 'Shimla', state: 'Himachal Pradesh', pincode: '171001', country: 'India', lat: 31.1048, lng: 77.1734 },
      phone: '+91 98000 00002',
      certifications: ['PGS-India Residue Free', 'Himachal Organic Board'],
      verificationStatus: 'approved',
      rating: 4.9,
      totalReviews: 84,
    },
    {
      userId: userMap['vikram.farm@freshfruit.demo']._id,
      farmName: 'Godavari Bio-Vines',
      bio: 'Residue-free seedless grapes and pomegranate agro-forestry.',
      farmAddress: { street: 'Dindori Agri Road', city: 'Nashik', state: 'Maharashtra', pincode: '422003', country: 'India', lat: 20.0059, lng: 73.7898 },
      phone: '+91 98000 00012',
      certifications: ['GlobalGAP Compliant', 'PGS-India Green'],
      verificationStatus: 'under_review',
      rating: 4.7,
      totalReviews: 42,
    },
    {
      userId: userMap['sunita.citrus@freshfruit.demo']._id,
      farmName: 'Vidarbha Sun-Citrus Farms',
      bio: 'Naturally irrigated mandarin orange orchards grown without synthetic wax coatings.',
      farmAddress: { street: 'Katol Orchard Belt', city: 'Nagpur', state: 'Maharashtra', pincode: '440001', country: 'India', lat: 21.1458, lng: 79.0882 },
      phone: '+91 98000 00013',
      certifications: ['India Organic Certified'],
      verificationStatus: 'pending',
      rating: 4.8,
      totalReviews: 19,
    },
  ];

  for (const fp of farmerSeeds) {
    await FarmerProfile.findOneAndUpdate({ userId: fp.userId }, fp, { upsert: true, new: true });
  }

  // 3. Ensure Categories
  const categorySeeds = [
    { name: 'Fresh Fruits', slug: 'fruits', description: 'Orchard-fresh fruits harvested at peak sweetness', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80', sortOrder: 1 },
    { name: 'Citrus & Lemons', slug: 'citrus', description: 'Sun-kissed vitamin C rich citrus varieties', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&q=80', sortOrder: 2 },
    { name: 'Berries & Vines', slug: 'berries', description: 'Hand-clipped fresh berries and seedless grapes', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80', sortOrder: 3 },
    { name: 'Tropical & Exotic', slug: 'tropical', description: 'Naturally ripened mangoes, papayas and avocados', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80', sortOrder: 4 },
    { name: 'Harvest Baskets', slug: 'baskets', description: 'Curated weekly farm assortments for families', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80', sortOrder: 5 },
  ];

  const catMap = {};
  for (const cat of categorySeeds) {
    const doc = await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    catMap[cat.slug] = doc._id;
  }

  // 4. Ensure Products
  const productSeeds = [
    {
      name: 'Himachal Royal Gala Apples',
      description: 'Crisp, sweet, and handpicked from high-altitude chemical-free orchards in Himachal Pradesh.',
      categoryId: catMap['fruits'],
      sellerId: userMap['seller@freshfruit.demo']._id,
      images: [{ url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80', isPrimary: true }],
      price: 180,
      discountPrice: 160,
      unit: '1 kg box',
      availableQuantity: 45,
      reservedQuantity: 5,
      grade: 'A',
      isOrganic: true,
      status: 'active',
      rating: 4.9,
      totalReviews: 128,
      totalSold: 320,
    },
    {
      name: 'Ratnagiri Alphonso Mangoes',
      description: 'GI-tagged authentic Ratnagiri Hapus with rich saffron pulp and unforgettable sweet aroma.',
      categoryId: catMap['tropical'],
      sellerId: userMap['seller@freshfruit.demo']._id,
      images: [{ url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80', isPrimary: true }],
      price: 750,
      discountPrice: 699,
      unit: 'Dozen (12 pcs)',
      availableQuantity: 8, // Low Stock Alert
      reservedQuantity: 2,
      grade: 'A',
      isOrganic: true,
      status: 'active',
      rating: 5.0,
      totalReviews: 240,
      totalSold: 610,
    },
    {
      name: 'Nagpur Organic Juicy Mandarins',
      description: 'Bursting with tangy-sweet natural juice, pesticide-free, and sun-ripened on black soil.',
      categoryId: catMap['citrus'],
      sellerId: userMap['sunita.citrus@freshfruit.demo']._id,
      images: [{ url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80', isPrimary: true }],
      price: 120,
      discountPrice: 105,
      unit: '1 kg net bag',
      availableQuantity: 65,
      reservedQuantity: 0,
      grade: 'A',
      isOrganic: true,
      status: 'active',
      rating: 4.8,
      totalReviews: 94,
      totalSold: 215,
    },
    {
      name: 'Mahabaleshwar Crimson Strawberries',
      description: 'Plump ruby red berries packed with antioxidants and zero synthetic waxing.',
      categoryId: catMap['berries'],
      sellerId: userMap['vikram.farm@freshfruit.demo']._id,
      images: [{ url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80', isPrimary: true }],
      price: 210,
      discountPrice: 190,
      unit: '500g punnet',
      availableQuantity: 4, // Critical Low Stock
      reservedQuantity: 1,
      grade: 'A',
      isOrganic: true,
      status: 'active',
      rating: 4.9,
      totalReviews: 182,
      totalSold: 410,
    },
    {
      name: 'Nashik Flame Seedless Grapes',
      description: 'Crisp, sweet seedless table grapes certified 100% residue-free.',
      categoryId: catMap['berries'],
      sellerId: userMap['vikram.farm@freshfruit.demo']._id,
      images: [{ url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&q=80', isPrimary: true }],
      price: 140,
      unit: '1 kg box',
      availableQuantity: 28,
      reservedQuantity: 0,
      grade: 'A',
      isOrganic: true,
      status: 'pending_approval', // Pending Product Approval
      rating: 4.7,
      totalReviews: 12,
      totalSold: 15,
    },
    {
      name: 'Family Orchard Harvest Basket',
      description: 'Curated mix of apples, mandarins, grapes and seasonal berries.',
      categoryId: catMap['baskets'],
      sellerId: userMap['seller@freshfruit.demo']._id,
      images: [{ url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80', isPrimary: true }],
      price: 899,
      discountPrice: 849,
      unit: '5 kg basket',
      availableQuantity: 15,
      reservedQuantity: 2,
      grade: 'A',
      isOrganic: true,
      status: 'active',
      rating: 4.9,
      totalReviews: 110,
      totalSold: 180,
    },
  ];

  const prodDocs = [];
  for (const p of productSeeds) {
    const doc = await Product.findOneAndUpdate({ name: p.name }, p, { upsert: true, new: true });
    prodDocs.push(doc);
  }

  // 5. Ensure Realistic Orders across timeline
  const now = new Date();
  const pastDays = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const orderSeeds = [
    {
      orderNumber: 'ORD-2026-9001',
      customerId: userMap['customer@freshfruit.demo']._id,
      deliveryAddress: { recipientName: 'Ananya Deshmukh', phone: '+91 98000 00003', street: 'B-12 Hill View Residency', city: 'Pune', state: 'Maharashtra', pincode: '411038' },
      items: [{ productId: prodDocs[0]._id, sellerId: prodDocs[0].sellerId, productName: prodDocs[0].name, unitPrice: prodDocs[0].price, unit: prodDocs[0].unit, quantity: 2, subtotal: 360 }],
      subtotal: 360,
      deliveryCharge: 40,
      totalAmount: 400,
      status: 'delivered',
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      createdAt: pastDays(1),
    },
    {
      orderNumber: 'ORD-2026-9002',
      customerId: userMap['karan.buyer@freshfruit.demo']._id,
      deliveryAddress: { recipientName: 'Karan Mehra', phone: '+91 98000 00014', street: '44 Orchid Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
      items: [{ productId: prodDocs[1]._id, sellerId: prodDocs[1].sellerId, productName: prodDocs[1].name, unitPrice: prodDocs[1].price, unit: prodDocs[1].unit, quantity: 1, subtotal: 750 }],
      subtotal: 750,
      discount: 50,
      couponCode: 'FRESH50',
      totalAmount: 700,
      status: 'in_transit',
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      createdAt: pastDays(0), // Today
    },
    {
      orderNumber: 'ORD-2026-9003',
      customerId: userMap['customer@freshfruit.demo']._id,
      deliveryAddress: { recipientName: 'Ananya Deshmukh', phone: '+91 98000 00003', street: 'B-12 Hill View Residency', city: 'Pune', state: 'Maharashtra', pincode: '411038' },
      items: [{ productId: prodDocs[2]._id, sellerId: prodDocs[2].sellerId, productName: prodDocs[2].name, unitPrice: prodDocs[2].price, unit: prodDocs[2].unit, quantity: 3, subtotal: 360 }],
      subtotal: 360,
      deliveryCharge: 40,
      totalAmount: 400,
      status: 'processing',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      createdAt: pastDays(2),
    },
    {
      orderNumber: 'ORD-2026-9004',
      customerId: userMap['karan.buyer@freshfruit.demo']._id,
      deliveryAddress: { recipientName: 'Karan Mehra', phone: '+91 98000 00014', street: '44 Orchid Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
      items: [{ productId: prodDocs[5]._id, sellerId: prodDocs[5].sellerId, productName: prodDocs[5].name, unitPrice: prodDocs[5].price, unit: prodDocs[5].unit, quantity: 1, subtotal: 899 }],
      subtotal: 899,
      totalAmount: 899,
      status: 'delivered',
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      createdAt: pastDays(5),
    },
    {
      orderNumber: 'ORD-2026-9005',
      customerId: userMap['customer@freshfruit.demo']._id,
      deliveryAddress: { recipientName: 'Ananya Deshmukh', phone: '+91 98000 00003', street: 'B-12 Hill View Residency', city: 'Pune', state: 'Maharashtra', pincode: '411038' },
      items: [{ productId: prodDocs[3]._id, sellerId: prodDocs[3].sellerId, productName: prodDocs[3].name, unitPrice: prodDocs[3].price, unit: prodDocs[3].unit, quantity: 2, subtotal: 420 }],
      subtotal: 420,
      totalAmount: 420,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      createdAt: pastDays(0), // Today
    },
    {
      orderNumber: 'ORD-2026-9006',
      customerId: userMap['karan.buyer@freshfruit.demo']._id,
      deliveryAddress: { recipientName: 'Karan Mehra', phone: '+91 98000 00014', street: '44 Orchid Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
      items: [{ productId: prodDocs[0]._id, sellerId: prodDocs[0].sellerId, productName: prodDocs[0].name, unitPrice: prodDocs[0].price, unit: prodDocs[0].unit, quantity: 1, subtotal: 180 }],
      subtotal: 180,
      totalAmount: 180,
      status: 'cancelled',
      paymentMethod: 'razorpay',
      paymentStatus: 'refunded',
      createdAt: pastDays(12),
    },
  ];

  const orderDocs = [];
  for (const o of orderSeeds) {
    const doc = await Order.findOneAndUpdate({ orderNumber: o.orderNumber }, o, { upsert: true, new: true });
    orderDocs.push(doc);
  }

  // 6. Ensure Payments & Refunds
  const paymentSeeds = [
    { orderId: orderDocs[0]._id, orderNumber: orderDocs[0].orderNumber, customerId: orderDocs[0].customerId, amount: orderDocs[0].totalAmount, method: 'razorpay', status: 'captured', razorpayPaymentId: 'pay_rzp_9901_mock', razorpayOrderId: 'order_rzp_9901_mock', capturedAt: pastDays(1) },
    { orderId: orderDocs[1]._id, orderNumber: orderDocs[1].orderNumber, customerId: orderDocs[1].customerId, amount: orderDocs[1].totalAmount, method: 'razorpay', status: 'captured', razorpayPaymentId: 'pay_rzp_9902_mock', razorpayOrderId: 'order_rzp_9902_mock', capturedAt: pastDays(0) },
    { orderId: orderDocs[3]._id, orderNumber: orderDocs[3].orderNumber, customerId: orderDocs[3].customerId, amount: orderDocs[3].totalAmount, method: 'razorpay', status: 'captured', razorpayPaymentId: 'pay_rzp_9904_mock', razorpayOrderId: 'order_rzp_9904_mock', capturedAt: pastDays(5) },
  ];

  for (const pm of paymentSeeds) {
    await Payment.findOneAndUpdate({ orderNumber: pm.orderNumber }, pm, { upsert: true, new: true });
  }

  const refundSeeds = [
    {
      orderId: orderDocs[5]._id,
      orderNumber: orderDocs[5].orderNumber,
      customerId: orderDocs[5].customerId,
      amount: orderDocs[5].totalAmount,
      reason: 'Customer cancelled prior to dispatch',
      status: 'processed',
      approvedBy: userMap['admin@freshfruit.demo']._id,
      processedAt: pastDays(11),
    },
    {
      orderId: orderDocs[2]._id,
      orderNumber: orderDocs[2].orderNumber,
      customerId: orderDocs[2].customerId,
      amount: 120,
      reason: 'Minor transit bruising on 1 kg batch',
      status: 'pending', // Pending Refund Approval in Dashboard
    },
  ];

  for (const rf of refundSeeds) {
    await Refund.findOneAndUpdate({ orderNumber: rf.orderNumber, reason: rf.reason }, rf, { upsert: true, new: true });
  }

  // 7. Delivery Assignments
  const deliverySeeds = [
    {
      orderId: orderDocs[1]._id,
      orderNumber: orderDocs[1].orderNumber,
      partnerId: userMap['delivery@freshfruit.demo']._id,
      partnerName: 'Suresh Express Fleet',
      status: 'in_transit',
      pickupLocation: { street: 'Shimla Valley Route 4', city: 'Shimla', state: 'Himachal Pradesh' },
      dropLocation: orderDocs[1].deliveryAddress,
      assignedAt: pastDays(0),
      isDelayed: false,
      currentLocation: { lat: 19.1136, lng: 72.8697, lastUpdated: new Date() },
    },
    {
      orderId: orderDocs[0]._id,
      orderNumber: orderDocs[0].orderNumber,
      partnerId: userMap['delivery@freshfruit.demo']._id,
      partnerName: 'Suresh Express Fleet',
      status: 'delivered',
      pickupLocation: { street: 'Shimla Valley Route 4', city: 'Shimla', state: 'Himachal Pradesh' },
      dropLocation: orderDocs[0].deliveryAddress,
      assignedAt: pastDays(1),
      deliveredAt: pastDays(0),
      isDelayed: false,
    },
    {
      orderId: orderDocs[2]._id,
      orderNumber: orderDocs[2].orderNumber,
      partnerId: userMap['rohit.delivery@freshfruit.demo']._id,
      partnerName: 'Rohit Speed Logistics',
      status: 'delayed', // Delayed Delivery Alert in Dashboard
      pickupLocation: { street: 'Katol Orchard Belt', city: 'Nagpur', state: 'Maharashtra' },
      dropLocation: orderDocs[2].deliveryAddress,
      assignedAt: pastDays(2),
      isDelayed: true,
      delayReason: 'Ghat section monsoon road diversion',
    },
  ];

  for (const d of deliverySeeds) {
    await DeliveryAssignment.findOneAndUpdate({ orderNumber: d.orderNumber }, d, { upsert: true, new: true });
  }

  // 8. Support Tickets
  const supportSeeds = [
    {
      ticketNumber: 'TCK-2026-101',
      userId: userMap['customer@freshfruit.demo']._id,
      orderId: orderDocs[2]._id,
      subject: 'Inquiry on delivery ETA for Nagpur Mandarins',
      description: 'Shipment has been in transit for 48 hours, looking for updated estimated delivery window.',
      category: 'delivery',
      status: 'in_progress',
      priority: 'high',
      assignedAgentId: userMap['support@freshfruit.demo']._id,
      assignedAgentName: 'Priya Customer Care',
      messages: [
        { senderId: userMap['customer@freshfruit.demo']._id, senderRole: 'customer', message: 'Hello, what is the updated ETA?', timestamp: pastDays(1) },
        { senderId: userMap['support@freshfruit.demo']._id, senderRole: 'support_agent', message: 'Hi Ananya, courier rerouted via Nashik highway, arriving tomorrow by 11 AM.', timestamp: pastDays(0) },
      ],
    },
    {
      ticketNumber: 'TCK-2026-102',
      userId: userMap['seller@freshfruit.demo']._id,
      subject: 'Assistance required updating cold-chain pickup time',
      description: 'Morning harvest slot shifted from 6 AM to 8 AM due to heavy dew.',
      category: 'seller',
      status: 'open',
      priority: 'urgent',
    },
  ];

  for (const st of supportSeeds) {
    await SupportTicket.findOneAndUpdate({ ticketNumber: st.ticketNumber }, st, { upsert: true, new: true });
  }

  // 9. Reviews & Ratings
  const reviewSeeds = [
    {
      customerId: userMap['customer@freshfruit.demo']._id,
      orderId: orderDocs[0]._id,
      productId: prodDocs[0]._id,
      sellerId: prodDocs[0].sellerId,
      rating: 5,
      title: 'Incredible crunch and natural sweetness',
      body: 'Arrived packaged in sustainable carton, tasted fresh like directly plucked from tree.',
      status: 'published',
      isVisible: true,
    },
    {
      customerId: userMap['karan.buyer@freshfruit.demo']._id,
      orderId: orderDocs[1]._id,
      productId: prodDocs[1]._id,
      sellerId: prodDocs[1].sellerId,
      rating: 5,
      title: 'Authentic Ratnagiri Hapus aroma',
      body: 'Best mangoes we had this season, zero chemicals used.',
      status: 'published',
      isVisible: true,
    },
    {
      customerId: userMap['karan.buyer@freshfruit.demo']._id,
      orderId: orderDocs[3]._id,
      productId: prodDocs[2]._id,
      sellerId: prodDocs[2].sellerId,
      rating: 3,
      title: 'Packaging was slightly damp',
      body: 'Fruit was good quality but outer cardboard had water moisture.',
      status: 'under_review', // Under review in moderation queue
      isVisible: false,
    },
  ];

  for (const rv of reviewSeeds) {
    await Review.findOneAndUpdate({ orderId: rv.orderId, customerId: rv.customerId }, rv, { upsert: true, new: true });
  }

  // 10. Platform Settings & Audit Logs
  await PlatformSettings.findOneAndUpdate(
    {},
    {
      platformName: 'FreshFruit Market',
      contactPhone: '+91 98000 00000',
      supportEmail: 'admin@freshfruit.demo',
      currency: 'INR',
      deliveryFee: 40,
      minOrderAmount: 199,
      sellerCommissionRate: 5,
      maintenanceMode: false,
    },
    { upsert: true, new: true }
  );

  const initialAuditLogs = [
    {
      adminId: userMap['admin@freshfruit.demo']._id,
      adminEmail: 'admin@freshfruit.demo',
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'PLATFORM',
      entityId: 'SETTINGS',
      details: { message: 'Configured platform baseline parameters and demo accounts' },
    },
    {
      adminId: userMap['admin@freshfruit.demo']._id,
      adminEmail: 'admin@freshfruit.demo',
      action: 'APPROVE_SELLER',
      entityType: 'FARMER_PROFILE',
      entityId: userMap['seller@freshfruit.demo']._id.toString(),
      details: { farmName: 'Sharma Alpine Orchards', status: 'approved' },
    },
  ];

  for (const al of initialAuditLogs) {
    await AuditLog.create(al);
  }

  console.log('[SUCCESS] All Admin data collections populated successfully!');
  console.log('='.repeat(60));
};

if (process.argv[1]?.endsWith('seed-admin-full-data.js')) {
  seedAdminData()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[SEED ERROR]', err);
      await disconnectDB();
      process.exit(1);
    });
}
