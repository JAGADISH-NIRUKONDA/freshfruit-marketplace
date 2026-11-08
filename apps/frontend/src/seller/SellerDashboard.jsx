import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Package,
  Plus,
  ShoppingBag,
  Boxes,
  IndianRupee,
  Star,
  User,
  Sprout,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Search,
  LogOut,
  ExternalLink,
  MapPin,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import OrderStatusBadge from '../components/dashboard/OrderStatusBadge';
import DataTable from '../components/dashboard/DataTable';
import { sellerApi } from '../services/sellerApi';

const SALES_DATA = [
  { month: 'Jun', sales: 18000 },
  { month: 'Jul', sales: 24000 },
  { month: 'Aug', sales: 29000 },
  { month: 'Sep', sales: 38000 },
  { month: 'Oct', sales: 42600 },
  { month: 'Nov', sales: 36000 },
];

const TOP_PRODUCTS = [
  {
    name: 'Mangoes',
    salesKg: '86 kg',
    revenue: '₹28,500',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Apples',
    salesKg: '72 kg',
    revenue: '₹14,400',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bananas',
    salesKg: '64 kg',
    revenue: '₹6,400',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&auto=format&fit=crop&q=80',
  },
];

export default function SellerDashboard({ sellerUser, onLogout, onExitToMarketplace }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'inventory' | 'earnings' | 'reviews' | 'profile'

  // Data states
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Products filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State for Create / Edit Product
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    discountPrice: '',
    unit: '1 kg box',
    availableQuantity: 50,
    grade: 'A',
    isOrganic: true,
    description: '',
    image: '',
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    farmName: '',
    bio: '',
    city: '',
    state: '',
    phone: '',
    certifications: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Load initial seller data
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, profileData, productsData, categoriesData] = await Promise.all([
        sellerApi.getStats().catch(() => null),
        sellerApi.getProfile().catch(() => null),
        sellerApi.getProducts().catch(() => ({ products: [] })),
        sellerApi.getCategories().catch(() => []),
      ]);

      if (statsData) setStats(statsData);
      if (profileData) {
        setProfile(profileData.profile);
        setProfileForm({
          farmName: profileData.profile.farmName || '',
          bio: profileData.profile.bio || '',
          city: profileData.profile.farmAddress?.city || '',
          state: profileData.profile.farmAddress?.state || '',
          phone: profileData.profile.phone || profileData.user?.phone || '',
          certifications: (profileData.profile.certifications || []).join(', '),
        });
      }
      if (productsData?.products) setProducts(productsData.products);
      if (categoriesData?.length > 0) {
        setCategories(categoriesData);
        if (!productForm.categoryId && categoriesData[0]) {
          setProductForm((prev) => ({
            ...prev,
            categoryId: categoriesData[0]._id || categoriesData[0].id,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load seller dashboard data:', err);
      showToast('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'low_stock' && p.availableQuantity > 0 && p.availableQuantity <= 10) ||
      (statusFilter === 'out_of_stock' && p.availableQuantity <= 0) ||
      p.status === statusFilter;
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: categories[0]?._id || categories[0]?.id || '',
      price: '',
      discountPrice: '',
      unit: '1 kg box',
      availableQuantity: 40,
      grade: 'A',
      isOrganic: true,
      description: '',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      categoryId: prod.categoryId || categories[0]?._id,
      price: prod.price,
      discountPrice: prod.discountPrice || prod.price,
      unit: prod.unit || '1 kg',
      availableQuantity: prod.availableQuantity,
      grade: prod.grade || 'A',
      isOrganic: prod.isOrganic ?? true,
      description: prod.description || '',
      image: prod.image || prod.images?.[0]?.url || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Please provide a name and price');
      return;
    }

    try {
      if (editingProduct) {
        const updated = await sellerApi.updateProduct(
          editingProduct.id || editingProduct._id,
          productForm
        );
        setProducts((prev) =>
          prev.map((p) =>
            (p.id || p._id) === (editingProduct.id || editingProduct._id) ? updated : p
          )
        );
        showToast(`Updated "${productForm.name}" successfully!`);
      } else {
        const created = await sellerApi.createProduct(productForm);
        setProducts((prev) => [created, ...prev]);
        showToast(`Listed "${productForm.name}" into your orchard catalog!`);
      }
      setIsProductModalOpen(false);
      sellerApi.getStats().then(setStats);
    } catch (err) {
      showToast(err.message || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await sellerApi.deleteProduct(productToDelete.id || productToDelete._id);
      setProducts((prev) =>
        prev.filter((p) => (p.id || p._id) !== (productToDelete.id || productToDelete._id))
      );
      showToast(`Removed "${productToDelete.name}" from catalog`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      sellerApi.getStats().then(setStats);
    } catch (err) {
      showToast(err.message || 'Failed to delete product');
    }
  };

  const handleAdjustStock = async (productId, delta) => {
    try {
      const updated = await sellerApi.adjustInventory(productId, { delta });
      setProducts((prev) =>
        prev.map((p) =>
          (p.id || p._id) === productId ? { ...p, availableQuantity: updated.availableQuantity } : p
        )
      );
      showToast(`Inventory updated to ${updated.availableQuantity} units`);
      sellerApi.getStats().then(setStats);
    } catch (err) {
      showToast(err.message || 'Stock adjustment failed');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await sellerApi.updateProfile({
        farmName: profileForm.farmName,
        bio: profileForm.bio,
        phone: profileForm.phone,
        farmAddress: {
          city: profileForm.city,
          state: profileForm.state,
        },
        certifications: profileForm.certifications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setProfile(updated.profile || updated);
      showToast('Orchard profile saved successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update farm profile');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package, badge: products.length || 58 },
    { id: 'add_product', label: '+ Add Product', icon: Plus },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: 436 },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (tabId) => {
    if (tabId === 'add_product') {
      handleOpenCreateModal();
    } else {
      setActiveTab(tabId);
    }
  };

  const sellerDisplayName = profile?.farmName || sellerUser?.name || 'Raju Farms';

  return (
    <DashboardLayout
      user={{
        name: sellerDisplayName,
        role: 'seller',
        avatar:
          profile?.profilePhoto ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      }}
      role="seller"
      roleTitle="Seller"
      navItems={navItems}
      activeTab={activeTab}
      onNavigate={handleNavClick}
      onLogout={onLogout}
      onExitToMarketplace={onExitToMarketplace}
      title="Seller Dashboard"
      subtitle="Manage your products, orders and sales"
      searchPlaceholder="Search harvests, order numbers..."
      unreadNotifications={3}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#064E2B] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400/40"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 text-left">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & DASHBOARD (Matching Collage Image)      */}
        {/* ========================================================= */}
        {(activeTab === 'dashboard' || activeTab === 'overview') && (
          <div className="space-y-6">
            {/* 1. TOP 4 KPI CARDS matching collage exactly */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <StatCard
                icon={IndianRupee}
                label="Total Sales"
                value={124500}
                prefix="₹"
                theme="green"
                trend="▲ 12%"
              />
              <StatCard
                icon={ShoppingBag}
                label="Orders"
                value={436}
                theme="purple"
                trend="▲ 8%"
              />
              <StatCard
                icon={Sprout}
                label="Products"
                value={products.length || 58}
                theme="green"
              />
              <StatCard
                icon={Star}
                label="Rating"
                value="4.8"
                theme="yellow"
                subtitle="(312 reviews)"
              />
            </div>

            {/* 2. SALES PERFORMANCE BAR CHART & TOP SELLING PRODUCTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sales Performance Bar Chart (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-stone-900 tracking-tight">
                      Sales Performance
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Monthly gross revenue from verified farm dispatches
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#16A34A] text-white text-xs font-bold shadow-xs">
                    ₹42,600
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        stroke="#94a3b8"
                        tickFormatter={(val) => `₹${val / 1000}k`}
                      />
                      <Tooltip
                        formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Gross Sales']}
                        contentStyle={{
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                      />
                      <Bar dataKey="sales" fill="#16A34A" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Selling Products List (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-stone-900 tracking-tight">
                      Top Selling Products
                    </h3>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {TOP_PRODUCTS.map((prod, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/70 border border-stone-200/70 hover:bg-emerald-50/50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-900">{prod.name}</p>
                            <p className="text-[11px] text-stone-500 font-medium">
                              {prod.revenue} generated
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                          {prod.salesKg}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100">
                  <button
                    onClick={handleOpenCreateModal}
                    className="w-full py-2.5 rounded-full bg-[#064E2B] hover:bg-[#04331C] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>List New Produce</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. LOW STOCK & INVENTORY ATTENTION TABLE */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-stone-900 tracking-tight">
                    Inventory Attention Needed
                  </h3>
                  <p className="text-xs text-stone-500">
                    Produce low in stock (&le; 10 units) requiring immediate crate restock
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Manage All Inventory &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {products.filter((p) => (p.availableQuantity || 0) <= 10).slice(0, 3).length > 0 ? (
                  products
                    .filter((p) => (p.availableQuantity || 0) <= 10)
                    .slice(0, 3)
                    .map((prod) => (
                      <div
                        key={prod.id || prod._id}
                        className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.image || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">{prod.name}</p>
                            <p className="text-[10px] text-amber-900 font-semibold">
                              {prod.availableQuantity || 0} units remaining
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAdjustStock(prod.id || prod._id, 20)}
                          className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-amber-300 rounded-lg text-xs font-bold text-emerald-800 transition cursor-pointer shrink-0"
                        >
                          +20
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full p-6 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-stone-800">Healthy Stock Levels</p>
                    <p className="text-[11px] text-stone-500">All current harvests have sufficient crates available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MY PRODUCTS (FULL CATALOG CRUD)                    */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-stone-900 tracking-tight">
                  Your Harvest Catalog
                </h3>
                <p className="text-xs text-stone-500">
                  Manage active listings, grades, prices, and organic certifications
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter products..."
                    className="pl-8 pr-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="low_stock">Low Stock (&le;10)</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>

                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-1.5 rounded-full bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Product',
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <img
                        src={row.image || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80'}
                        alt={row.name}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{row.name}</p>
                        <p className="text-[10px] text-stone-400">
                          Grade {row.grade || 'A'} &bull; {row.isOrganic ? 'Certified Organic' : 'Conventional'}
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'price',
                  label: 'Price / Unit',
                  render: (row) => (
                    <span className="font-extrabold text-stone-900">
                      ₹{row.price} <span className="text-stone-400 font-normal">/{row.unit || 'kg'}</span>
                    </span>
                  ),
                },
                {
                  key: 'availableQuantity',
                  label: 'Stock Crates',
                  render: (row) => (
                    <span
                      className={`font-black text-xs ${
                        row.availableQuantity <= 0
                          ? 'text-rose-600'
                          : row.availableQuantity <= 10
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {row.availableQuantity} units
                    </span>
                  ),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => (
                    <OrderStatusBadge
                      status={
                        row.availableQuantity <= 0
                          ? 'out_of_stock'
                          : row.status || 'active'
                      }
                    />
                  ),
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  cellClassName: 'text-right',
                  render: (row) => (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(row)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition cursor-pointer"
                        title="Edit Produce"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(row);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                        title="Delete Produce"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredProducts}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: INVENTORY CONTROL                                  */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-stone-900 tracking-tight">
                Live Inventory Management
              </h3>
              <p className="text-xs text-stone-500">
                Directly adjust crate stock quantities available to customer marketplace
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id || prod._id}
                  className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">{prod.name}</p>
                      <p className="text-[11px] text-stone-500">₹{prod.price}/{prod.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <span className="text-xs font-bold text-stone-700">
                      In Stock: <strong className="text-emerald-800">{prod.availableQuantity}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(prod.id || prod._id, -10)}
                        disabled={prod.availableQuantity <= 0}
                        className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleAdjustStock(prod.id || prod._id, 20)}
                        className="px-2.5 py-1 bg-[#16A34A] text-white rounded-lg text-xs font-bold hover:bg-[#15803d] shadow-xs cursor-pointer"
                      >
                        +20
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PROFILE SETTINGS                                   */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs max-w-2xl">
            <h3 className="text-base font-black text-stone-900 tracking-tight mb-1">
              Farm &amp; Orchard Credentials
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Update your public farmer storefront details visible on the marketplace
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Farm / Orchard Name</label>
                <input
                  type="text"
                  value={profileForm.farmName}
                  onChange={(e) => setProfileForm({ ...profileForm, farmName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Bio / Story</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Certifications (comma separated)
                </label>
                <input
                  type="text"
                  value={profileForm.certifications}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, certifications: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#16A34A] hover:bg-[#15803d] text-white font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 z-10 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-base font-black text-stone-900">
                  {editingProduct ? 'Edit Harvest Item' : 'List New Harvest Produce'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Produce Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Royal Gala Apples"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="180"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Unit</label>
                    <input
                      type="text"
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      placeholder="1 kg box"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Available Crates</label>
                    <input
                      type="number"
                      value={productForm.availableQuantity}
                      onChange={(e) =>
                        setProductForm({ ...productForm, availableQuantity: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Quality Grade</label>
                    <select
                      value={productForm.grade}
                      onChange={(e) => setProductForm({ ...productForm, grade: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                    >
                      <option value="A+">Grade A+ (Premium Export)</option>
                      <option value="A">Grade A (Choice Fresh)</option>
                      <option value="B">Grade B (Standard)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl font-bold transition shadow-xs"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Produce'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-stone-900">Delete Harvest Item?</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Remove "{productToDelete?.name}" from your catalog?
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
