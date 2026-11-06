import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Star,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Search,
  MessageSquare,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  Send,
  Loader2,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { marketplaceApi } from '../services/marketplaceApi';

export default function FarmerStorefrontModal({
  farmerId,
  isOpen,
  onClose,
  onOpenProductDetails,
  onAddToCart,
}) {
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState({ sending: false, success: false, error: '' });
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Fetch farmer profile and storefront produce
  useEffect(() => {
    if (!isOpen || !farmerId) return;

    let isMounted = true;
    setLoading(true);
    setSearchQuery('');
    setSelectedCategory('all');
    setIsInquiryOpen(false);
    setInquiryStatus({ sending: false, success: false, error: '' });

    marketplaceApi
      .getFarmerStorefront(farmerId, { search: searchQuery, category: selectedCategory })
      .then((data) => {
        if (isMounted) {
          setFarmer(data.farmer);
          setProducts(data.products || []);
        }
      })
      .catch((err) => {
        console.error('Error fetching farmer storefront:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, farmerId]);

  // Handle client-side or backend search & category filter update
  useEffect(() => {
    if (!isOpen || !farmerId || !farmer) return;

    const timer = setTimeout(() => {
      marketplaceApi
        .getFarmerStorefront(farmerId, { search: searchQuery, category: selectedCategory })
        .then((data) => {
          setProducts(data.products || []);
        })
        .catch((err) => console.error(err));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, farmerId, isOpen]);

  // Handle inquiry submit
  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) {
      setInquiryStatus({ sending: false, success: false, error: 'Please fill in all required fields.' });
      return;
    }

    setInquiryStatus({ sending: true, success: false, error: '' });
    try {
      await marketplaceApi.sendFarmerInquiry(farmerId, inquiryForm);
      setInquiryStatus({ sending: false, success: true, error: '' });
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setIsInquiryOpen(false);
        setInquiryStatus({ sending: false, success: false, error: '' });
      }, 2500);
    } catch (err) {
      setInquiryStatus({ sending: false, success: false, error: err.message || 'Failed to submit inquiry' });
    }
  };

  // Derive unique categories present in farmer's products
  const categoryFilters = [
    { id: 'all', label: 'All Orchard Harvests' },
    ...Array.from(new Set(products.map((p) => p.category))).map((cat) => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/60 shadow-md flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            {/* 1. Header Banner & Farmer Profile Info */}
            <div className="relative bg-gradient-to-br from-[#075B43] to-[#008C60] text-white">
              <div className="h-44 sm:h-56 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80"
                  alt="Orchard Canopy"
                  className="w-full h-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#075B43] via-[#075B43]/60 to-transparent" />
              </div>

              {/* Farmer Info Bar */}
              <div className="relative px-6 sm:px-10 pb-8 -mt-20 sm:-mt-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                  <div className="relative">
                    <img
                      src={
                        farmer?.image ||
                        'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={farmer?.farmerName}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-stone-100"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#A3E635] text-[#075B43] p-1.5 rounded-xl shadow-md border-2 border-white" title="Verified Organic Producer">
                      <ShieldCheck className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-white">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#A3E635] text-[#075B43] px-2.5 py-0.5 rounded-full font-sans">
                        Verified Organic Grower
                      </span>
                      {farmer?.isVerified && (
                        <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full border border-white/20">
                          PGS-India Certified
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {farmer?.farmName || 'Sharma Alpine Orchards'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100">
                      <span className="font-semibold text-white">Grower: {farmer?.farmerName}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#A3E635]" />
                        {farmer?.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        {farmer?.rating || 4.9} ({farmer?.totalReviews || 24} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact / Inquiry Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsInquiryOpen(!isInquiryOpen)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#075B43] hover:bg-[#F6FAF7] font-extrabold text-xs transition shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#008C60]" />
                    <span>Inquire / Bulk Order</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Inquiry Drawer / Dropdown */}
            <AnimatePresence>
              {isInquiryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#F6FAF7] border-b border-stone-200 overflow-hidden"
                >
                  <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#191D1A]">
                          Send an Inquiry to {farmer?.farmerName}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Direct inquiry for harvest availability, custom crates, or orchard visits.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsInquiryOpen(false)}
                        className="text-stone-400 hover:text-stone-700 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    {inquiryStatus.success ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Your inquiry has been relayed to the grower! They will reply soon.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSendInquiry} className="space-y-3">
                        {inquiryStatus.error && (
                          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                            {inquiryStatus.error}
                          </p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Your Name *"
                            value={inquiryForm.name}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                            className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#008C60]"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Email Address *"
                            value={inquiryForm.email}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                            className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#008C60]"
                            required
                          />
                          <input
                            type="tel"
                            placeholder="Phone (Optional)"
                            value={inquiryForm.phone}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                            className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#008C60]"
                          />
                        </div>
                        <textarea
                          placeholder="Your message or questions about bulk harvest..."
                          rows={2}
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                          className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs outline-hidden focus:border-[#008C60]"
                          required
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={inquiryStatus.sending}
                            className="px-5 py-2 rounded-xl bg-[#008C60] hover:bg-[#075B43] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {inquiryStatus.sending ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Send Message</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. Farmer Bio & Certifications Story */}
            <div className="p-6 sm:p-10 border-b border-stone-200 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#008C60]">
                    About {farmer?.farmName}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {farmer?.bio ||
                      'Cultivating pesticide-free fruits and vegetables using traditional Vedic farming and biological pest management. Harvested daily at dawn and packed in food-grade eco-friendly crates.'}
                  </p>
                </div>

                <div className="bg-[#F6FAF7] p-4 rounded-2xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                    Certifications & Guarantees
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(farmer?.certifications?.length > 0
                      ? farmer.certifications
                      : ['Zero Chemical Wax', 'PGS-India Organic', 'Naturally Ripened']
                    ).map((cert, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-[#075B43] font-bold text-[10px] px-2.5 py-1 rounded-lg border border-stone-200/80 shadow-2xs flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#008C60]" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Storefront Produce Catalog */}
            <div className="p-6 sm:p-10 bg-[#F6FAF7] space-y-6">
              {/* Controls: Search & Category tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#191D1A]">
                    Available Farm Harvests
                  </h3>
                  <p className="text-xs text-stone-500">
                    Showing {products.length} seasonal produce items available from this orchard
                  </p>
                </div>

                {/* In-Storefront Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in this orchard..."
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs outline-hidden focus:border-[#008C60]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              {categoryFilters.length > 2 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categoryFilters.map((cat) => {
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-[#008C60] text-white shadow-xs'
                            : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Products Loading Skeletons */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-4 border border-stone-200 animate-pulse space-y-3">
                      <div className="aspect-4/3 bg-stone-200 rounded-2xl" />
                      <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                      <div className="h-6 bg-stone-200 rounded-xl w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Products Grid */}
              {!loading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((item) => {
                    const isOutOfStock = item.inStock <= 0;
                    return (
                      <div
                        key={item.id || item._id}
                        className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
                      >
                        {/* Image */}
                        <div
                          onClick={() => {
                            onClose();
                            onOpenProductDetails(item);
                          }}
                          className="relative aspect-4/3 bg-[#F6FAF7] overflow-hidden cursor-pointer"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            {item.isOrganic && (
                              <span className="bg-[#008C60] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                Organic
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-2.5 left-3">
                            {isOutOfStock ? (
                              <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md">
                                Sold Out
                              </span>
                            ) : (
                              <span className="bg-emerald-950/80 backdrop-blur-xs text-[#A3E635] font-bold text-[10px] px-2 py-0.5 rounded-md">
                                {item.inStock} Available
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4
                              onClick={() => {
                                onClose();
                                onOpenProductDetails(item);
                              }}
                              className="font-extrabold text-sm text-[#191D1A] group-hover:text-[#008C60] transition line-clamp-1 cursor-pointer hover:underline"
                            >
                              {item.name}
                            </h4>
                            <p className="text-xs text-stone-500 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <div>
                              <span className="text-base font-black text-[#191D1A]">
                                ₹{item.discountPrice || item.price}
                              </span>
                              <span className="text-[11px] text-stone-400 font-semibold ml-1">
                                /{item.unit}
                              </span>
                            </div>

                            <button
                              onClick={() => onAddToCart(item)}
                              disabled={isOutOfStock}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                isOutOfStock
                                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                  : 'bg-[#008C60] hover:bg-[#075B43] text-white shadow-xs'
                              }`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{isOutOfStock ? 'Sold' : 'Add'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty state */}
              {!loading && products.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6 space-y-2">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <h4 className="font-bold text-sm text-stone-700">No harvests found</h4>
                  <p className="text-xs text-stone-400">
                    No matching produce currently in this orchard for the selected filter.
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="text-xs text-[#008C60] font-bold hover:underline"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

