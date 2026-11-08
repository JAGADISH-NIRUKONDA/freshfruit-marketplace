import React from 'react';
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Tag,
  Star,
  Plus,
  Apple,
  Carrot,
} from 'lucide-react';

export default function DashboardOverviewView({
  statsData,
  customerName = 'Jagadish',
  onNavigateTab,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenProductDetails,
}) {
  const stats = statsData?.stats || {
    totalOrders: 12,
    ordersTrend: '+20%',
    wishlistItems: 8,
    wishlistTrend: '+33%',
    cartItems: 3,
    totalSavings: 540,
    savingsTrend: '+16%',
  };

  const tracking = statsData?.tracking || {
    orderNumber: 'FF1245',
    steps: [
      { key: 'placed', label: 'Order Placed', time: '10:24 AM', date: 'Nov 7', completed: true, active: false },
      { key: 'packed', label: 'Packed', time: '11:10 AM', date: 'Nov 7', completed: true, active: false },
      { key: 'out_for_delivery', label: 'Out for Delivery', time: '2:30 PM', date: 'Nov 7', completed: false, active: true },
      { key: 'delivered', label: 'Delivered', time: 'Estimated by 5:00 PM', date: 'Nov 7', completed: false, active: false },
    ],
  };

  const recentOrders = statsData?.recentOrders || [
    {
      _id: 'rec-1',
      orderNumber: 'FF1245',
      date: 'Nov 6, 2026',
      status: 'Delivered',
      totalAmount: 420,
      primaryItemName: 'Fresh Apples (2kg)',
      primaryItemImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80',
    },
    {
      _id: 'rec-2',
      orderNumber: 'FF1244',
      date: 'Nov 5, 2026',
      status: 'In Transit',
      totalAmount: 280,
      primaryItemName: 'Organic Bananas (1 doz)',
      primaryItemImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&auto=format&fit=crop&q=80',
    },
    {
      _id: 'rec-3',
      orderNumber: 'FF1243',
      date: 'Nov 3, 2026',
      status: 'Delivered',
      totalAmount: 360,
      primaryItemName: 'Farm Fresh Tomatoes (1kg)',
      primaryItemImage: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&auto=format&fit=crop&q=80',
    },
  ];

  const recommendedProducts = statsData?.recommendedProducts || [
    {
      _id: 'rec-p1',
      name: 'Fresh Apples',
      price: 120,
      originalPrice: 150,
      unit: 'kg',
      discount: '20% OFF',
      rating: 4.8,
      reviewsCount: 245,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80',
    },
    {
      _id: 'rec-p2',
      name: 'Bananas',
      price: 48,
      originalPrice: 60,
      unit: 'doz',
      discount: '20% OFF',
      rating: 4.7,
      reviewsCount: 189,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
    },
    {
      _id: 'rec-p3',
      name: 'Oranges',
      price: 90,
      originalPrice: 110,
      unit: 'kg',
      discount: '18% OFF',
      rating: 4.9,
      reviewsCount: 312,
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80',
    },
    {
      _id: 'rec-p4',
      name: 'Green Grapes',
      price: 160,
      originalPrice: 200,
      unit: 'kg',
      discount: '20% OFF',
      rating: 4.7,
      reviewsCount: 165,
      image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout matching reference screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN (7.5/12 cols)                                 */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. HERO PROMOTIONAL BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#dcfce7] via-[#e8fbf0] to-[#f0fdf4] border border-emerald-100/80 p-6 sm:p-8 shadow-sm">
            {/* Background subtle leaf glow */}
            <div className="absolute top-0 right-1/3 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-md space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a3d24] tracking-tight">
                    Welcome Back,
                  </h1>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0a3d24] tracking-tight flex items-center gap-2">
                  <span>{customerName}!</span>
                  <span className="text-2xl animate-bounce">👋</span>
                </div>
                <p className="text-stone-600 text-xs sm:text-sm font-medium leading-relaxed">
                  Fresh fruits, vegetables and farm products delivered to your doorstep.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateTab('shop')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0a3d24] hover:bg-[#072c1a] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Basket of Fresh Fruits with Water Splash */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] shrink-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80"
                  alt="Fresh Fruit Basket"
                  className="w-full h-44 sm:h-52 object-cover rounded-2xl shadow-md border-2 border-white/60 transform hover:scale-[1.02] transition duration-300"
                />
              </div>
            </div>

            {/* Carousel Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a3d24]" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-300/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-300/60" />
            </div>
          </div>

          {/* 2. FOUR KPI STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Card 1: Total Orders */}
            <div className="bg-[#ecfdf5] border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-[#059669]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Total Orders
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                {stats.ordersTrend || '+20%'}
              </span>
            </div>

            {/* Card 2: Wishlist Items */}
            <div className="bg-[#fff7ed] border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c]">
                  <Heart className="w-5 h-5 fill-orange-400/20" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Wishlist Items
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    {stats.wishlistItems}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                {stats.wishlistTrend || '+33%'}
              </span>
            </div>

            {/* Card 3: Cart Items */}
            <div className="bg-[#f5f3ff] border border-purple-100 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-[#7c3aed]">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Cart Items
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    {stats.cartItems}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Total Savings */}
            <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-[#2563eb]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Total Savings
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    ₹{stats.totalSavings}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                {stats.savingsTrend || '+16%'}
              </span>
            </div>
          </div>

          {/* 3. TODAY'S SPECIAL OFFER BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d4f2e] via-[#105e37] to-[#15803d] text-white p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left z-10">
              <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest">
                Today's Special Offer
              </p>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Up to 30% OFF
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100">
                on Fresh Fruits & Vegetables
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('offers')}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#0d4f2e] text-xs font-bold shadow-md hover:bg-emerald-50 transition cursor-pointer"
                >
                  <span>Grab Offer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right graphic with 30% badge & fresh basket */}
            <div className="relative z-10 flex items-center gap-4 shrink-0">
              {/* Starburst 30% OFF badge */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 border-2 border-white/80 shadow-lg flex flex-col items-center justify-center text-center rotate-[-8deg] transform animate-pulse">
                <span className="text-xs sm:text-sm font-black leading-none text-white">30%</span>
                <span className="text-[9px] font-extrabold uppercase text-white/90">OFF</span>
              </div>

              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80"
                alt="Special Offer Produce"
                className="w-28 h-24 sm:w-36 sm:h-28 object-cover rounded-2xl shadow-lg border-2 border-white/30"
              />
            </div>
          </div>

          {/* 4. RECOMMENDED FOR YOU CAROUSEL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Recommended for You
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('shop')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="hidden sm:flex items-center gap-1 ml-2">
                  <button className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              {recommendedProducts.slice(0, 4).map((product) => {
                const isWish = wishlistIds.includes(product._id || product.id);
                return (
                  <div
                    key={product._id || product.name}
                    className="group bg-white rounded-2xl border border-stone-200/80 p-3.5 flex flex-col justify-between hover:shadow-md transition hover:border-emerald-200 relative"
                  >
                    {/* Discount badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[10px] font-extrabold bg-[#e8fbf0] text-[#0a3d24] border border-emerald-200 px-2 py-0.5 rounded-md">
                        {product.discount || '20% OFF'}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-50 mb-3 cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => onOpenProductDetails && onOpenProductDetails(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-1.5 text-left">
                      <h4
                        onClick={() => onOpenProductDetails && onOpenProductDetails(product)}
                        className="text-xs sm:text-sm font-bold text-stone-900 truncate hover:text-emerald-700 cursor-pointer"
                      >
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-[#0a3d24]">
                          ₹{product.price}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          /{product.unit || 'kg'}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Rating & Add button */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating || 4.8}</span>
                          <span className="text-stone-400 font-normal">
                            ({product.reviewsCount || 150})
                          </span>
                        </div>

                        <button
                          onClick={() => onAddToCart && onAddToCart(product)}
                          className="w-7 h-7 rounded-lg bg-[#0a3d24] hover:bg-[#062918] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                          title="Add to cart"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN (4.5/12 cols)                                */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. ORDER TRACKING WIDGET */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Order Tracking</h3>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                #{tracking.orderNumber || 'FF1245'}
              </span>
            </div>

            {/* Illustration Graphic + Route Pin */}
            <div className="relative bg-emerald-50/50 rounded-2xl p-3 mb-5 border border-emerald-100/60 flex items-center justify-between">
              <div className="space-y-0.5 text-left">
                <p className="text-[11px] font-bold text-emerald-800">Express Delivery</p>
                <p className="text-[10px] text-stone-500">From Sharma Orchards</p>
              </div>

              {/* Graphic icon box with vegetable box and route pin */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center text-xl">
                  📦
                </div>
                <div className="w-6 h-0.5 border-t border-dashed border-emerald-400" />
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* 4-Stage Vertical Timeline */}
            <div className="space-y-4 relative pl-3 text-left">
              {/* Vertical connector line */}
              <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-stone-200" />

              {tracking.steps.map((step, idx) => {
                const isCompleted = step.completed;
                const isActive = step.active;

                return (
                  <div key={step.key || idx} className="relative flex items-start gap-3.5 z-10">
                    {/* Circle Node */}
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ring-4 ring-emerald-50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ring-4 ring-emerald-100 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-400 flex items-center justify-center shrink-0 ring-4 ring-stone-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                      </div>
                    )}

                    {/* Step Content */}
                    <div
                      className={`flex-1 rounded-xl p-2 transition ${
                        isActive ? 'bg-emerald-50/70 border border-emerald-200/80' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs font-bold ${
                            isActive
                              ? 'text-emerald-900'
                              : isCompleted
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                      <p className="text-[10px] text-stone-500 font-medium mt-0.5">
                        {step.date ? `${step.date}, ` : ''}
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. RECENT ORDERS LIST */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Recent Orders</h3>
              </div>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer inline-flex items-center gap-0.5"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {recentOrders.map((order) => {
                const isDelivered = order.status?.toLowerCase().includes('delivered');
                return (
                  <div
                    key={order._id || order.orderNumber}
                    className="py-3 flex items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={order.primaryItemImage || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'}
                        alt={order.orderNumber}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-[10px] text-stone-500">{order.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs font-bold text-stone-900">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. QUICK ACTIONS (2x2 Grid) */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-stone-900">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              {/* Tile 1: Shop Fruits */}
              <button
                onClick={() => onNavigateTab('shop')}
                className="bg-[#ecfdf5] hover:bg-[#d1fae5] border border-emerald-100 rounded-2xl p-3.5 transition flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-200/70 flex items-center justify-center text-emerald-800 group-hover:scale-110 transition">
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 leading-tight">Shop</p>
                  <p className="text-[11px] text-emerald-800 font-semibold">Fruits</p>
                </div>
              </button>

              {/* Tile 2: Shop Vegetables */}
              <button
                onClick={() => onNavigateTab('shop')}
                className="bg-[#fff7ed] hover:bg-[#ffedd5] border border-orange-100 rounded-2xl p-3.5 transition flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-200/70 flex items-center justify-center text-orange-800 group-hover:scale-110 transition">
                  <Carrot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 leading-tight">Shop</p>
                  <p className="text-[11px] text-orange-800 font-semibold">Vegetables</p>
                </div>
              </button>

              {/* Tile 3: Track Order */}
              <button
                onClick={() => onNavigateTab('orders')}
                className="bg-[#f5f3ff] hover:bg-[#ede9fe] border border-purple-100 rounded-2xl p-3.5 transition flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-200/70 flex items-center justify-center text-purple-800 group-hover:scale-110 transition">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 leading-tight">Track</p>
                  <p className="text-[11px] text-purple-800 font-semibold">Order</p>
                </div>
              </button>

              {/* Tile 4: Offers & Deals */}
              <button
                onClick={() => onNavigateTab('offers')}
                className="bg-[#eff6ff] hover:bg-[#dbeafe] border border-blue-100 rounded-2xl p-3.5 transition flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-200/70 flex items-center justify-center text-blue-800 group-hover:scale-110 transition">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 leading-tight">Offers</p>
                  <p className="text-[11px] text-blue-800 font-semibold">& Deals</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
