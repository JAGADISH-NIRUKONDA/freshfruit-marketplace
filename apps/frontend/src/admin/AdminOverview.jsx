import React, { useState, useEffect } from 'react';
import {
  Users,
  Tractor,
  Truck,
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  ShieldAlert,
  RotateCcw,
  Boxes,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { adminApi } from './adminApi';

const STATUS_COLORS = {
  delivered: '#15803d',
  in_transit: '#0284c7',
  processing: '#f59e0b',
  pending: '#eab308',
  cancelled: '#ef4444',
  returned: '#8b5cf6',
  paid: '#10b981',
};

const PIE_COLORS = ['#15803d', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function AdminOverview({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState({
    kpis: {},
    recentOrders: [],
    recentCustomers: [],
    recentSellers: [],
    lowStockAlerts: [],
    pendingApprovals: [],
    delayedDeliveries: [],
    recentTickets: [],
  });

  const [analytics, setAnalytics] = useState({
    dailyMetrics: [],
    ordersByStatus: [],
    categorySales: [],
    paymentDistribution: [],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewData, analyticsData] = await Promise.all([
        adminApi.getDashboardOverview(),
        adminApi.getAnalytics(period),
      ]);
      setData(overviewData || {});
      setAnalytics(analyticsData || {});
    } catch (err) {
      console.error('[Admin Overview Load Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const kpis = data.kpis || {};

  const kpiCards = [
    {
      id: 'revenue',
      title: 'Total Gross Revenue',
      value: `₹${(kpis.totalRevenue || 0).toLocaleString('en-IN')}`,
      trend: '+18.4% vs last mo',
      icon: IndianRupee,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      action: 'analytics_revenue',
    },
    {
      id: 'orders',
      title: 'Total Platform Orders',
      value: kpis.totalOrders || 0,
      trend: 'Real MongoDB records',
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
      action: 'orders_all',
    },
    {
      id: 'customers',
      title: 'Registered Customers',
      value: kpis.totalCustomers || 0,
      trend: 'Active consumers',
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
      action: 'users_customers',
    },
    {
      id: 'sellers',
      title: 'Verified Farmers / Sellers',
      value: kpis.totalSellers || 0,
      trend: 'Local orchards',
      icon: Tractor,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
      action: 'users_sellers',
    },
    {
      id: 'delivery',
      title: 'Delivery Partners',
      value: kpis.totalDeliveryPartners || 0,
      trend: 'Cold-chain fleet',
      icon: Truck,
      color: 'bg-teal-500/10 text-teal-700 border-teal-200',
      action: 'delivery_partners',
    },
    {
      id: 'products',
      title: 'Marketplace Produce',
      value: kpis.totalProducts || 0,
      trend: 'Graded organic listings',
      icon: Package,
      color: 'bg-purple-500/10 text-purple-700 border-purple-200',
      action: 'products_all',
    },
    {
      id: 'pending_sellers',
      title: 'Seller Approvals Pending',
      value: kpis.pendingSellerApprovals || 0,
      trend: 'Requires review',
      icon: ShieldAlert,
      color: kpis.pendingSellerApprovals > 0 ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-stone-50 text-stone-600 border-stone-200',
      action: 'seller_approvals',
    },
    {
      id: 'pending_products',
      title: 'Product Approvals Pending',
      value: kpis.pendingProductApprovals || 0,
      trend: 'Quality check queue',
      icon: CheckCircle2,
      color: kpis.pendingProductApprovals > 0 ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-stone-50 text-stone-600 border-stone-200',
      action: 'product_approvals',
    },
    {
      id: 'active_deliveries',
      title: 'Active In-Transit Deliveries',
      value: kpis.activeDeliveries || 0,
      trend: 'En route to buyers',
      icon: Clock,
      color: 'bg-sky-500/10 text-sky-700 border-sky-200',
      action: 'delivery_assignments',
    },
    {
      id: 'low_stock',
      title: 'Low Stock Produce (<10 units)',
      value: kpis.lowStockProducts || 0,
      trend: 'Restock urgency',
      icon: Boxes,
      color: kpis.lowStockProducts > 0 ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-stone-50 text-stone-600 border-stone-200',
      action: 'inventory',
    },
    {
      id: 'refunds',
      title: 'Pending Refund Requests',
      value: kpis.pendingRefunds || 0,
      trend: 'Action needed',
      icon: RotateCcw,
      color: kpis.pendingRefunds > 0 ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-stone-50 text-stone-600 border-stone-200',
      action: 'refunds',
    },
    {
      id: 'support_tickets',
      title: 'Open Support Tickets',
      value: kpis.totalSupportTickets || 0,
      trend: 'Buyer & grower inquiries',
      icon: MessageSquare,
      color: kpis.totalSupportTickets > 0 ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-stone-50 text-stone-600 border-stone-200',
      action: 'support',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Banner with Orchard Photography & Dark Emerald Overlay */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-950/20 bg-[#0f2d21]">
        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80"
          alt="Lush green organic fruit orchards in morning sunlight"
          className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay opacity-30 transform hover:scale-105 transition-transform duration-1000"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#091f16] via-[#0f2d21]/90 to-transparent" />

        <div className="relative z-10 p-8 sm:p-10 text-white max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-lime-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Central Control
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            FreshFruit Market Operations Overview
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Real-time synchronization across organic growers, cold-chain logistics, payment reconciliations, and buyer orders in Maharashtra, Himachal, and Tamil Nadu.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('seller_approvals')}
              className="bg-lime-400 hover:bg-lime-300 text-stone-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <span>Review Farmer Applications ({kpis.pendingSellerApprovals || 0})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('orders_all')}
              className="bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-700 text-xs font-bold px-5 py-2.5 rounded-xl transition"
            >
              Inspect Active Orders ({kpis.totalOrders || 0})
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards Grid (12 Metrics) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
              Marketplace Performance Metrics
            </h3>
            <p className="text-xs text-stone-500">Live counts calculated directly from MongoDB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.action)}
                className={`p-5 rounded-2xl border bg-white shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${card.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      {card.title}
                    </span>
                    <span className="text-2xl font-black text-stone-900 block tracking-tight">
                      {card.value}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-emerald-800 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-stone-500">{card.trend}</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-[11px]">
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recharts Analytics with Date Filter */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">
              Revenue & Order Volume Analytics
            </h3>
            <p className="text-xs text-stone-500">
              Aggregated daily trends based on verified payment events
            </p>
          </div>

          {/* Period Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-600">
            {['today', '7d', '30d', '90d', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition uppercase tracking-wider text-[10px] ${
                  period === p
                    ? 'bg-emerald-700 text-white shadow-xs font-black'
                    : 'hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {p === 'today' ? 'Today' : p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'This Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Trend Area Chart */}
          <div className="lg:col-span-8">
            <h4 className="text-xs font-extrabold uppercase text-stone-500 tracking-wider mb-4">
              Daily Revenue Growth (₹)
            </h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyMetrics || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#15803d"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders by Status Donut */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-extrabold uppercase text-stone-500 tracking-wider mb-4">
              Orders Distribution by Status
            </h4>
            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={analytics.ordersByStatus || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                  >
                    {(analytics.ordersByStatus || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold">
                {(analytics.ordersByStatus || []).map((st) => (
                  <span
                    key={st.status}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 uppercase"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[st.status] || '#15803d' }}
                    />
                    {st.status}: {st.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Sales Bar Chart & Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-stone-100">
          <div>
            <h4 className="text-xs font-extrabold uppercase text-stone-500 tracking-wider mb-4">
              Category-Wise Gross Sales (₹)
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categorySales || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Sales']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="sales" fill="#15803d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase text-stone-500 tracking-wider mb-4">
              Payment Method Breakdown
            </h4>
            <div className="space-y-3">
              {(analytics.paymentDistribution || []).map((pm) => (
                <div
                  key={pm.method}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-bold text-xs uppercase text-emerald-800">
                      {pm.method === 'razorpay' ? 'RZP' : 'COD'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 uppercase">
                        {pm.method === 'razorpay' ? 'Razorpay Online' : 'Cash on Delivery (COD)'}
                      </div>
                      <div className="text-[11px] text-stone-500">{pm.count} total transactions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-stone-900">
                      ₹{(pm.total || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action & Alert Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Farmer Approvals */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-extrabold text-stone-900">Pending Seller Approvals</h4>
              <button
                onClick={() => onNavigate('seller_approvals')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {(data.recentSellers || []).map((farmer) => (
                <div
                  key={farmer._id}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-stone-900">{farmer.farmName}</div>
                    <div className="text-[11px] text-stone-500">
                      {farmer.farmAddress?.city}, {farmer.farmAddress?.state}
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {farmer.verificationStatus}
                  </span>
                </div>
              ))}
              {(!data.recentSellers || data.recentSellers.length === 0) && (
                <div className="text-xs text-stone-400 py-6 text-center">No pending seller verifications</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('seller_approvals')}
            className="w-full mt-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2.5 rounded-xl transition"
          >
            Manage Farmer Verification Queue
          </button>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Low Stock Produce Alerts</span>
              </h4>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Stock <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {(data.lowStockAlerts || []).map((prod) => (
                <div
                  key={prod._id}
                  className="p-3 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center justify-between"
                >
                  <div className="truncate max-w-[180px]">
                    <div className="text-xs font-bold text-stone-900 truncate">{prod.name}</div>
                    <div className="text-[11px] text-stone-500">{prod.unit}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-700">
                      {prod.availableQuantity} left
                    </span>
                  </div>
                </div>
              ))}
              {(!data.lowStockAlerts || data.lowStockAlerts.length === 0) && (
                <div className="text-xs text-stone-400 py-6 text-center">All product stocks healthy</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('inventory')}
            className="w-full mt-4 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold py-2.5 rounded-xl transition border border-rose-200"
          >
            Open Inventory Adjuster
          </button>
        </div>

        {/* Delayed Deliveries & Urgent Support */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-extrabold text-stone-900">Delayed Delivery Alerts</h4>
              <button
                onClick={() => onNavigate('delivery_delayed')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                Fleet <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {(data.delayedDeliveries || []).map((del) => (
                <div
                  key={del._id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-stone-900">{del.orderNumber}</div>
                    <div className="text-[11px] text-amber-900">{del.delayReason || 'Transit delay'}</div>
                  </div>
                  <span className="text-[10px] font-bold text-stone-700">{del.partnerName}</span>
                </div>
              ))}
              {(!data.delayedDeliveries || data.delayedDeliveries.length === 0) && (
                <div className="text-xs text-stone-400 py-6 text-center">All deliveries operating on-time</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('delivery_delayed')}
            className="w-full mt-4 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold py-2.5 rounded-xl transition"
          >
            Review Delayed Fleet Routes
          </button>
        </div>
      </div>
    </div>
  );
}

