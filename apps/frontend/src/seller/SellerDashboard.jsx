import React, { useState, useEffect, useCallback } from 'react';
import {
  Sprout,
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Boxes,
  ShieldCheck,
  Star,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  LogOut,
  Save,
  X,
  ExternalLink,
  MapPin,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sellerApi } from '../services/sellerApi';

export default function SellerDashboard({ sellerUser, onLogout, onExitToMarketplace }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'inventory' | 'profile'

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
  const [editingProduct, setEditingProduct] = useState(null); // null if creating
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State for Create / Edit Product
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    discountPrice: '',
    unit: '1 kg',
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
          setProductForm((prev) => ({ ...prev, categoryId: categoriesData[0]._id || categoriesData[0].id }));
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

  // Open Create Product Modal
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

  // Open Edit Product Modal
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

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Please provide a name and price');
      return;
    }

    try {
      if (editingProduct) {
        const updated = await sellerApi.updateProduct(editingProduct.id || editingProduct._id, productForm);
        setProducts((prev) =>
          prev.map((p) => ((p.id || p._id) === (editingProduct.id || editingProduct._id) ? updated : p))
        );
        showToast(`Updated "${productForm.name}" successfully!`);
      } else {
        const created = await sellerApi.createProduct(productForm);
        setProducts((prev) => [created, ...prev]);
        showToast(`Listed "${productForm.name}" into your orchard catalog!`);
      }
      setIsProductModalOpen(false);
      // Reload stats
      sellerApi.getStats().then(setStats);
    } catch (err) {
      showToast(err.message || 'Operation failed');
    }
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await sellerApi.deleteProduct(productToDelete.id || productToDelete._id);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== (productToDelete.id || productToDelete._id)));
      showToast(`Removed "${productToDelete.name}" from catalog`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      sellerApi.getStats().then(setStats);
    } catch (err) {
      showToast(err.message || 'Failed to delete product');
    }
  };

  // Quick Stock Adjustment
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

  // Save Farm Profile
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
      setProfile(updated.profile);
      showToast('Farm profile details saved successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#191D1A] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#075B43] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-600/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A3E635]" />
          <span className="font-bold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Seller Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Farm Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#008C60] flex items-center justify-center text-white shadow-md shadow-[#008C60]/20">
              <Sprout className="w-5 h-5 text-[#A3E635]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-[#191D1A] leading-none">
                  {profile?.farmName || `${sellerUser?.name}'s Orchard`}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#075B43] px-2 py-0.5 rounded-full">
                  Seller Hub
                </span>
              </div>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#008C60]" />
                {profile?.farmAddress?.city || 'Nashik'}, {profile?.farmAddress?.state || 'Maharashtra'}
              </span>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExitToMarketplace}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008C60] hover:bg-[#075B43] text-white text-xs font-bold shadow-md shadow-[#008C60]/15 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Harvest</span>
            </button>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-stone-400 hover:text-rose-600 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-stone-100 pt-1 pb-1">
          {[
            { id: 'overview', label: 'Orchard Overview', icon: TrendingUp },
            { id: 'products', label: 'Product Catalog', icon: Package },
            { id: 'inventory', label: 'Inventory Control', icon: Boxes },
            { id: 'profile', label: 'Farm Profile Settings', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#008C60] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 w-full">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & STATISTICS */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                  <span>Total Harvests</span>
                  <Package className="w-4 h-4 text-[#008C60]" />
                </div>
                <div className="text-3xl font-black text-[#191D1A]">
                  {stats?.totalProducts ?? products.length}
                </div>
                <div className="text-[11px] text-stone-500">
                  <span className="text-[#008C60] font-bold">{stats?.activeProducts ?? products.length} active</span> in customer marketplace
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                  <span>Available Stock</span>
                  <Boxes className="w-4 h-4 text-[#008C60]" />
                </div>
                <div className="text-3xl font-black text-[#191D1A]">
                  {stats?.totalUnitsAvailable ?? products.reduce((acc, p) => acc + (p.availableQuantity || 0), 0)}
                </div>
                <div className="text-[11px] text-stone-500">
                  Total crate units available for purchase
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                  <span>Units Dispatched</span>
                  <TrendingUp className="w-4 h-4 text-[#008C60]" />
                </div>
                <div className="text-3xl font-black text-[#191D1A]">
                  {stats?.totalUnitsSold ?? 142}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold">
                  Farm-to-customer orders fulfilled
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
                  <span>Grower Rating</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-[#191D1A]">
                  {stats?.farmerRating || 4.9}
                </div>
                <div className="text-[11px] text-stone-500">
                  Based on verified customer reviews
                </div>
              </div>
            </div>

            {/* Quick Actions & Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Low Stock Alerts */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#191D1A]">
                      Inventory Attention Needed
                    </h3>
                    <p className="text-xs text-stone-500">
                      Harvests low in stock (&le; 10 units) or out of stock
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-bold text-[#008C60] hover:underline"
                  >
                    Manage Inventory &rarr;
                  </button>
                </div>

                <div className="space-y-2">
                  {products.filter((p) => p.availableQuantity <= 10).slice(0, 4).length > 0 ? (
                    products
                      .filter((p) => p.availableQuantity <= 10)
                      .slice(0, 4)
                      .map((prod) => (
                        <div
                          key={prod.id || prod._id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#F6FAF7] border border-stone-200/80"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <h4 className="font-bold text-xs text-[#191D1A]">{prod.name}</h4>
                              <span className="text-[10px] text-stone-400 font-semibold">
                                {prod.categoryName} &bull; ₹{prod.price}/{prod.unit}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                prod.availableQuantity <= 0
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {prod.availableQuantity <= 0
                                ? 'Sold Out'
                                : `${prod.availableQuantity} Left`}
                            </span>
                            <button
                              onClick={() => handleAdjustStock(prod.id || prod._id, 20)}
                              className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-[#008C60] transition"
                            >
                              +20 Crates
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="p-8 text-center bg-[#F6FAF7] rounded-2xl">
                      <CheckCircle2 className="w-8 h-8 text-[#008C60] mx-auto mb-2" />
                      <p className="text-xs font-bold text-stone-700">Healthy stock levels!</p>
                      <p className="text-[11px] text-stone-400">All current harvests have sufficient available crates.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Farm Profile Summary Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#191D1A]">Farm Credentials</h3>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-xs font-bold text-[#008C60] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-stone-400 font-semibold block">Orchard Name</span>
                    <span className="font-bold text-[#191D1A]">{profile?.farmName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-semibold block">Grower Verification</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {profile?.verificationStatus?.toUpperCase() || 'APPROVED'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-semibold block">Farm Location</span>
                    <span className="font-semibold text-stone-700">
                      {profile?.farmAddress?.city || 'Nashik'}, {profile?.farmAddress?.state || 'Maharashtra'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-semibold block">Certifications</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(profile?.certifications || ['PGS-India Organic']).map((c, i) => (
                        <span
                          key={i}
                          className="bg-[#F6FAF7] border border-stone-200 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCT MANAGEMENT (CRUD) */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#191D1A]">Your Harvest Catalog</h3>
                <p className="text-xs text-stone-500">
                  Create, edit, and control organic produce listed from your farm
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search harvests..."
                    className="pl-8 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs outline-hidden focus:border-[#008C60]"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="low_stock">Low Stock (&le;10)</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>

                <button
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008C60] hover:bg-[#075B43] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Product</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F6FAF7] border-b border-stone-200 text-stone-500 uppercase tracking-wider font-extrabold text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Harvest Item</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price / Unit</th>
                      <th className="px-6 py-4">Inventory</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id || prod._id} className="hover:bg-stone-50/70 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <span className="font-extrabold text-[#191D1A] block">{prod.name}</span>
                                <span className="text-stone-400 text-[11px] line-clamp-1">
                                  {prod.description}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                              {prod.categoryName || prod.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-extrabold text-[#191D1A]">₹{prod.price}</span>
                            <span className="text-stone-400 text-[11px]"> /{prod.unit}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`font-black ${
                                prod.availableQuantity <= 0
                                  ? 'text-rose-600'
                                  : prod.availableQuantity <= 10
                                  ? 'text-amber-600'
                                  : 'text-stone-800'
                              }`}
                            >
                              {prod.availableQuantity} crates
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                prod.availableQuantity <= 0
                                  ? 'bg-rose-100 text-rose-700'
                                  : prod.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {prod.availableQuantity <= 0 ? 'Sold Out' : prod.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                title="Edit Harvest"
                                className="p-1.5 rounded-lg text-stone-500 hover:text-[#008C60] hover:bg-emerald-50 transition"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setProductToDelete(prod);
                                  setIsDeleteModalOpen(true);
                                }}
                                title="Delete from Catalog"
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                          No products found matching your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: INVENTORY CONTROL */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-black text-[#191D1A]">Live Inventory Control</h3>
              <p className="text-xs text-stone-500">
                Instantly adjust orchard stock quantities. Changes sync live with customer shopping baskets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id || prod._id}
                  className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-stone-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-extrabold text-sm text-[#191D1A] line-clamp-1">{prod.name}</h4>
                      <span className="text-xs text-stone-400 block">
                        ₹{prod.price} / {prod.unit}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${
                          prod.availableQuantity <= 0
                            ? 'bg-rose-100 text-rose-700'
                            : prod.availableQuantity <= 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.availableQuantity <= 0
                          ? 'Sold Out'
                          : `${prod.availableQuantity} crates available`}
                      </span>
                    </div>
                  </div>

                  {/* Fast Stock Adjust Steppers */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-500 block">
                      Quick Stock Adjustment:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleAdjustStock(prod.id || prod._id, -5)}
                        disabled={prod.availableQuantity <= 0}
                        className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 rounded-xl text-xs font-bold text-stone-700 transition"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleAdjustStock(prod.id || prod._id, 10)}
                        className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-xs font-bold text-[#008C60] transition"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleAdjustStock(prod.id || prod._id, 25)}
                        className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-xs font-bold text-[#008C60] transition"
                      >
                        +25
                      </button>
                      <button
                        onClick={() => handleAdjustStock(prod.id || prod._id, 50)}
                        className="py-1.5 px-2 bg-[#008C60] hover:bg-[#075B43] text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        +50
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FARM PROFILE SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-black text-[#191D1A]">Farm & Orchard Profile</h3>
              <p className="text-xs text-stone-500">
                This profile information is presented to customers visiting your storefront on FreshFruit.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Orchard / Farm Name *
                  </label>
                  <input
                    type="text"
                    value={profileForm.farmName}
                    onChange={(e) => setProfileForm({ ...profileForm, farmName: e.target.value })}
                    className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs outline-hidden focus:border-[#008C60]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs outline-hidden focus:border-[#008C60]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City / Tehsil
                  </label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    placeholder="e.g. Shimla or Nashik"
                    className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs outline-hidden focus:border-[#008C60]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    placeholder="e.g. Himachal Pradesh"
                    className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs outline-hidden focus:border-[#008C60]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Certifications (comma separated)
                </label>
                <input
                  type="text"
                  value={profileForm.certifications}
                  onChange={(e) => setProfileForm({ ...profileForm, certifications: e.target.value })}
                  placeholder="e.g. PGS-India Organic, Zero Pesticide Residue, NPOP"
                  className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs outline-hidden focus:border-[#008C60]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Farm Story & Cultivation Bio
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Describe your organic cultivation methods, soil health, and farm history..."
                  className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl p-3 text-xs outline-hidden focus:border-[#008C60]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#008C60] hover:bg-[#075B43] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Details</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT PRODUCT */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10"
            >
              <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-extrabold text-base text-[#191D1A]">
                  {editingProduct ? 'Edit Harvest Item' : 'List New Orchard Produce'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Produce Name *
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Kinnaur Crisp Red Apples"
                    className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-[#008C60]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold outline-hidden focus:border-[#008C60]"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Selling Unit
                    </label>
                    <input
                      type="text"
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      placeholder="e.g. 1 kg box"
                      className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#008C60]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="180"
                      className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#008C60]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Initial Stock (Crates)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={productForm.availableQuantity}
                      onChange={(e) => setProductForm({ ...productForm, availableQuantity: e.target.value })}
                      placeholder="50"
                      className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#008C60]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#008C60]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Harvest Description
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Taste profile, sweetness, natural tree-ripening details..."
                    className="w-full bg-[#F6FAF7] border border-stone-200 rounded-xl p-3 text-xs outline-hidden focus:border-[#008C60]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOrganicCheck"
                    checked={productForm.isOrganic}
                    onChange={(e) => setProductForm({ ...productForm, isOrganic: e.target.checked })}
                    className="w-4 h-4 rounded-md text-[#008C60] accent-[#008C60]"
                  />
                  <label htmlFor="isOrganicCheck" className="text-xs font-bold text-stone-700">
                    Certified Organic (Chemical residue-free guarantee)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#008C60] hover:bg-[#075B43] text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Produce'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
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
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-[#191D1A]">Delete Harvest Item?</h4>
                <p className="text-xs text-stone-500">
                  Are you sure you want to remove <strong className="text-stone-900">"{productToDelete?.name}"</strong> from your catalog?
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
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
    </div>
  );
}

