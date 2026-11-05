import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Star,
  ChevronRight,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  Minus,
  Trash2,
  User,
  LogOut,
  RefreshCw,
  Clock,
  Award,
  Zap,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/v1';

// Initial Produce Catalog
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Himachal Royal Gala Apples',
    category: 'fruits',
    farm: 'Sharma Alpine Orchards, Shimla',
    price: 180,
    originalPrice: 220,
    unit: '1 kg box',
    rating: 4.9,
    reviews: 128,
    harvestDate: 'Harvested Yesterday',
    inStock: 35,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, sweet, and handpicked from high-altitude chemical-free orchards in Himachal Pradesh.',
  },
  {
    id: 'prod-2',
    name: 'Ratnagiri Alphonso Mangoes',
    category: 'tropical',
    farm: 'Konkan Heritage Agro, Ratnagiri',
    price: 750,
    originalPrice: 900,
    unit: 'Dozen (12 pcs)',
    rating: 5.0,
    reviews: 240,
    harvestDate: 'Naturally Ripened',
    inStock: 18,
    tag: 'Seasonal Special',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    description: 'GI-tagged authentic Ratnagiri Hapus with rich saffron pulp and unforgettable sweet aroma.',
  },
  {
    id: 'prod-3',
    name: 'Nagpur Organic Juicy Mandarins',
    category: 'citrus',
    farm: 'Vidarbha Citrus Cooperative, Nagpur',
    price: 120,
    originalPrice: 150,
    unit: '1 kg net bag',
    rating: 4.8,
    reviews: 94,
    harvestDate: 'Fresh Picked',
    inStock: 42,
    tag: 'High Vitamin C',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    description: 'Bursting with tangy-sweet natural juice, pesticide-free, and sun-ripened on black soil.',
  },
  {
    id: 'prod-4',
    name: 'Mahabaleshwar Crimson Strawberries',
    category: 'berries',
    farm: 'Sahyadri Berry Valley, Mahabaleshwar',
    price: 210,
    originalPrice: 260,
    unit: '500g punnet',
    rating: 4.9,
    reviews: 182,
    harvestDate: 'Air-Delivered Daily',
    inStock: 14,
    tag: 'Limited Batch',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    description: 'Plump ruby red berries packed with antioxidants and zero synthetic waxing.',
  },
  {
    id: 'prod-5',
    name: 'Nashik Seedless Crimson Grapes',
    category: 'berries',
    farm: 'Godavari Valley Bio-Vines, Nashik',
    price: 140,
    originalPrice: 175,
    unit: '1 kg box',
    rating: 4.7,
    reviews: 86,
    harvestDate: 'Morning Harvest',
    inStock: 28,
    tag: 'Residue Free',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, sweet seedless table grapes certified 100% residue-free by PGS-India standards.',
  },
  {
    id: 'prod-6',
    name: 'South Indian Golden Robusta Bananas',
    category: 'fruits',
    farm: 'Cauvery Delta Organic Groves, Erode',
    price: 65,
    originalPrice: 80,
    unit: '1 kg bundle',
    rating: 4.8,
    reviews: 110,
    harvestDate: 'Natural Tree Ripened',
    inStock: 50,
    tag: 'Daily Essential',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally sweet bananas ripened without carbide gases, delivering wholesome potassium.',
  },
  {
    id: 'prod-7',
    name: 'Kashmir Sweet Cherry Basket',
    category: 'fruits',
    farm: 'Dal Lake Blossom Groves, Srinagar',
    price: 380,
    originalPrice: 450,
    unit: '500g wooden basket',
    rating: 5.0,
    reviews: 64,
    harvestDate: 'Cold-Chain Fresh',
    inStock: 12,
    tag: 'Premium Pick',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
    description: 'Deep mahogany sweet cherries with juicy snap, shipped under strict cold-chain control.',
  },
  {
    id: 'prod-8',
    name: 'Organic Family Harvest Assortment',
    category: 'baskets',
    farm: 'Community Farm Co-op, Pune Foothills',
    price: 899,
    originalPrice: 1150,
    unit: '5 kg curated box',
    rating: 4.9,
    reviews: 312,
    harvestDate: 'Packed this Morning',
    inStock: 20,
    tag: 'Best Value',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    description: 'A curated variety box containing apples, citrus, seasonal berries, bananas, and honey melon.',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Produce', icon: '🌱' },
  { id: 'fruits', name: 'Orchard Fruits', icon: '🍎' },
  { id: 'citrus', name: 'Citrus & Lemons', icon: '🍊' },
  { id: 'berries', name: 'Berries & Vines', icon: '🍇' },
  { id: 'tropical', name: 'Tropical & Exotic', icon: '🥭' },
  { id: 'baskets', name: 'Harvest Baskets', icon: '📦' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Backend Health State
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    dbStatus: 'unknown',
    uptime: 0,
    version: '',
  });

  // Check Backend Health
  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const json = await res.json();
        setBackendHealth({
          status: 'online',
          dbStatus: json.data?.database?.status || 'connected',
          uptime: json.data?.uptimeSeconds || 0,
          version: json.data?.version || '1.0.0',
        });
      } else {
        setBackendHealth({ status: 'offline', dbStatus: 'disconnected', uptime: 0, version: '' });
      }
    } catch {
      setBackendHealth({ status: 'offline', dbStatus: 'disconnected', uptime: 0, version: '' });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check saved token on mount
  useEffect(() => {
    const token = localStorage.getItem('freshfruit_jwt');
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (data.data?.user) setCurrentUser(data.data.user);
        })
        .catch(() => {
          localStorage.removeItem('freshfruit_jwt');
        });
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Cart Management
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Authentication Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const endpoint = authMode === 'login' ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    const payload =
      authMode === 'login'
        ? { email: authFormData.email, password: authFormData.password }
        : {
            name: authFormData.name,
            email: authFormData.email,
            password: authFormData.password,
            role: authFormData.role,
          };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || (data.errors ? data.errors[0]?.message : 'Authentication failed'));
      }

      if (data.data?.token) {
        localStorage.setItem('freshfruit_jwt', data.data.token);
        setCurrentUser(data.data.user);
        setIsAuthModalOpen(false);
        showToast(`Welcome ${data.data.user.name || 'back'}!`);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('freshfruit_jwt');
    setCurrentUser(null);
    showToast('Logged out successfully');
  };

  // Filtered Products
  const filteredProducts = INITIAL_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Real-time Backend Health */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
              Farm-To-Door
            </span>
            <span>Zero chemical wax • Harvested within 24 hours of dispatch</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth.status === 'online'
                    ? 'bg-emerald-400 animate-pulse'
                    : backendHealth.status === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              <span className="font-mono text-[11px]">
                API: {backendHealth.status === 'online' ? 'Online (v1.0)' : 'Offline'} | DB:{' '}
                {backendHealth.dbStatus === 'connected' ? 'Connected' : 'Pending'}
              </span>
              <button
                onClick={checkHealth}
                title="Refresh Status"
                className="text-stone-400 hover:text-white transition"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-stone-900 block leading-none">
                FreshFruit<span className="text-emerald-600">.</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-500 block">
                Organic Direct
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mangoes, apples, berries, farms..."
                className="w-full bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-sm text-stone-800 rounded-full pl-10 pr-4 py-2.5 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop Links & Actions */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <a href="#produce" className="hover:text-emerald-700 transition">
              Harvest Catalog
            </a>
            <a href="#benefits" className="hover:text-emerald-700 transition">
              Why Direct
            </a>
            <a href="#farmers" className="hover:text-emerald-700 transition">
              Meet Farmers
            </a>
            <a href="#seller-cta" className="hover:text-emerald-700 transition text-emerald-700 font-semibold">
              Sell Produce
            </a>
          </div>

          {/* User Account & Cart Button */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2.5 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-stone-800 max-w-[110px] truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] uppercase font-extrabold text-emerald-700 tracking-wider leading-none mt-0.5">
                    {currentUser.role?.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="text-stone-400 hover:text-rose-600 transition ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 transition"
              >
                <User className="w-3.5 h-3.5 text-stone-500" />
                Sign In
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Basket</span>
              {totalCartItems > 0 && (
                <span className="bg-amber-400 text-stone-900 rounded-full px-1.5 py-0.2 text-[10px] font-black">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-stone-700 hover:text-stone-900 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fruits, farms, varieties..."
                className="w-full bg-stone-100 text-sm rounded-full pl-10 pr-4 py-2 border border-stone-200"
              />
            </div>
            <nav className="flex flex-col gap-2.5 text-sm font-medium text-stone-700">
              <a
                href="#produce"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-emerald-600"
              >
                Harvest Catalog
              </a>
              <a
                href="#benefits"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-emerald-600"
              >
                Why Direct Trade
              </a>
              <a
                href="#farmers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 hover:text-emerald-600"
              >
                Meet Our Farmers
              </a>
              <a
                href="#seller-cta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 text-emerald-700 font-semibold"
              >
                Sell Produce on FreshFruit
              </a>
            </nav>
            {!currentUser && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full bg-stone-900 text-white font-medium py-2 rounded-xl text-sm"
              >
                Sign In / Register
              </button>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-stone-50 to-[#fbfbf9] pt-12 pb-20 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Pure Chemical-Free Harvests
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.12]">
                Sun-Ripened Fruits, <br />
                <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                  Straight From Orchards
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Skip stale cold storages, middlemen price markups, and chemical ripening.
                We bridge verified family orchards directly to your home table within 24 hours of picking.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#produce"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-emerald-700/25 hover:shadow-xl transition-all"
                >
                  Shop Seasonal Harvest
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#seller-cta"
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm px-6 py-3.5 rounded-full border border-stone-300 shadow-xs hover:border-stone-400 transition"
                >
                  Become a Partner Grower
                </a>
              </div>

              {/* Trust Pillars */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Residue-Free</h4>
                    <p className="text-[11px] text-stone-500">PGS-India Certified</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">&lt;24 Hr Harvest</h4>
                    <p className="text-[11px] text-stone-500">Never Cold-Gassed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">80% To Farmers</h4>
                    <p className="text-[11px] text-stone-500">Guaranteed Fair Value</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-4 shadow-2xl border border-stone-200/70">
                <div className="relative h-80 rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
                    alt="Fresh organic fruits basket"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Top Rated Farm Batch
                  </div>
                </div>

                {/* Floating Farm Origin Card */}
                <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                      Featured Orchard
                    </p>
                    <h3 className="text-sm font-bold text-stone-900">Sahyadri Valley Organics</h3>
                    <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      Nashik, Maharashtra • 4.9 ★ (340 reviews)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      const el = document.getElementById('produce');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Selection Filter */}
      <section className="py-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-900">Explore Harvest Categories</h2>
            <span className="text-xs font-medium text-stone-500">
              Showing {filteredProducts.length} items
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="produce" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                Picked Today • Ready To Ship
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                Fresh Harvest Direct Catalog
              </h2>
            </div>
            <p className="text-sm text-stone-500 max-w-md">
              Every listing is backed by farm identity transparency. Scan produce origin, harvest date, and farmer profile before purchasing.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 shadow-xs">
                    {product.tag}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {product.rating} ({product.reviews})
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-emerald-700 block truncate">
                      {product.farm}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1 leading-snug group-hover:text-emerald-700 transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-600 bg-stone-50 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{product.harvestDate}</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-500 font-medium">{product.unit}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-stone-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Direct Fair Price
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl shadow-xs hover:shadow-md transition flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300">
              <Leaf className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-700">No produce matching your search</h3>
              <p className="text-xs text-stone-500 mt-1">
                Try searching for another keyword or change your active category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-xs font-bold bg-stone-900 text-white px-4 py-2 rounded-full"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Benefits / Why Direct Section */}
      <section id="benefits" className="py-20 bg-stone-100/70 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              The FreshFruit Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Why Farm-Direct Tastes & Feels Superior
            </h2>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              Industrial grocery chains store fruits for months using chemical preservatives. We cut all intermediaries to deliver peak natural flavor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Zero Harmful Residue</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Growers on FreshFruit are vetted for non-toxic pest management and organic bio-fertilizer usage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">24-Hour Farm to Door</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Produce is picked at peak natural sugar content, sorted on-farm, and delivered immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Fair Farmer Prosperity</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Growers receive up to 80% of final retail value compared to merely 25% through conventional mandis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Eco Bio-Packaging</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Packed in recyclable corrugated boxes and breathable cornstarch covers without single-use plastics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Farmers Spotlight */}
      <section id="farmers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-2">
              Transparent Traceability
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Know The Farmers Who Grow Your Food
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Every crate has a story. Meet the generational stewards keeping our soil vibrant and pesticide-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-stone-200 p-6 bg-stone-50/50 hover:bg-stone-50 transition">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=200&q=80"
                  alt="Farmer Rajesh"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600"
                />
                <div>
                  <h3 className="text-base font-bold text-stone-900">Rajesh Sharma</h3>
                  <p className="text-xs text-stone-500">Shimla, Himachal Pradesh</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">14 Years Organic Apple Grower</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "Direct selling through FreshFruit gave my family orchards freedom from commission brokers. We can now afford eco-composting and zero chemical sprays."
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 p-6 bg-stone-50/50 hover:bg-stone-50 transition">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Farmer Anand"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600"
                />
                <div>
                  <h3 className="text-base font-bold text-stone-900">Anand Deshmukh</h3>
                  <p className="text-xs text-stone-500">Nashik, Maharashtra</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">GI-Tagged Crimson Grape Grower</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "Customers actually taste our harvest on the same day it is clipped from the vines. The difference in freshness and crunch is night and day."
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 p-6 bg-stone-50/50 hover:bg-stone-50 transition">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Farmer Lakshmi"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600"
                />
                <div>
                  <h3 className="text-base font-bold text-stone-900">Lakshmi R.</h3>
                  <p className="text-xs text-stone-500">Pollachi, Tamil Nadu</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">Coconut & Banana Forest Farm</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "Our regenerative agro-forestry model thrives because conscious customers appreciate authentic nutrition and transparent farmer pricing."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seller CTA Banner */}
      <section id="seller-cta" className="py-16 bg-emerald-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-700">
                Partner With FreshFruit Market
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Are You An Organic Orchard Or Vegetable Farmer?
              </h2>
              <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
                Connect directly with thousands of health-conscious families. Set your own transparent pricing, access our cold-chain pickup logistics, and get guaranteed weekly payouts.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-emerald-200 pt-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Transparent 80% Payout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Farm-Gate Pickup Logistics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time Inventory Portal</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setAuthMode('register');
                  setAuthFormData({ ...authFormData, role: 'seller' });
                  setIsAuthModalOpen(true);
                }}
                className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm px-6 py-4 rounded-2xl shadow-xl transition-all text-center"
              >
                Register as Grower / Seller
              </button>
              <p className="text-[11px] text-center text-emerald-300">
                Instant onboarding • Verified within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 text-xs pt-16 pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
            {/* Brand Col */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white">
                  FreshFruit<span className="text-emerald-500">.</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                Empowering smallholder organic growers across India with direct market access and fair compensation, delivering clean food to families.
              </p>
              <div className="pt-2 flex items-center gap-3 text-stone-300">
                <span className="text-[11px]">Backend API connected on:</span>
                <code className="text-[11px] bg-stone-900 px-2 py-0.5 rounded text-emerald-400">
                  {API_BASE}
                </code>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Produce</h4>
              <ul className="space-y-2">
                <li><a href="#produce" className="hover:text-white transition">Himalayan Apples</a></li>
                <li><a href="#produce" className="hover:text-white transition">Konkan Mangoes</a></li>
                <li><a href="#produce" className="hover:text-white transition">Nashik Table Grapes</a></li>
                <li><a href="#produce" className="hover:text-white transition">Nagpur Citrus</a></li>
                <li><a href="#produce" className="hover:text-white transition">Family Harvest Boxes</a></li>
              </ul>
            </div>

            {/* Farmers & Platform */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Community</h4>
              <ul className="space-y-2">
                <li><a href="#farmers" className="hover:text-white transition">Partner Orchards</a></li>
                <li><a href="#seller-cta" className="hover:text-white transition">Grower Guidelines</a></li>
                <li><a href="#benefits" className="hover:text-white transition">Pesticide Testing Lab</a></li>
                <li><a href="#benefits" className="hover:text-white transition">Eco-Packaging Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Direct Support</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 98000 00000</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>harvest@freshfruit.local</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nashik Agri-Tech Corridor</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
            <p>© {new Date().getFullYear()} FreshFruit Market MERN. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-stone-300">Privacy Policy</a>
              <a href="#" className="hover:text-stone-300">Terms of Fair Trade</a>
              <a href="#" className="hover:text-stone-300">Residue Test Reports</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-in Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-stone-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-stone-900 text-base">Your Harvest Basket</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {totalCartItems} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-200 bg-white shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-stone-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.unit}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-stone-900">
                        ₹{item.price * item.quantity}
                      </span>
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1 border border-stone-200">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="p-1 text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="p-1 text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-20 text-stone-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-semibold text-stone-600">Your basket is empty</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Add handpicked farm fruits from our catalog!
                  </p>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Farm Dispatch Packaging</span>
                  <span className="text-emerald-700 font-bold">FREE (Eco-Box)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                  <span>Total Order</span>
                  <span className="text-base text-emerald-800">₹{cartSubtotal}</span>
                </div>
                <button
                  onClick={() => {
                    showToast('Demo order registered! Checkout workflow complete.');
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow-md text-xs uppercase tracking-wider transition"
                >
                  Proceed to Direct Farm Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Register directly to Express Backend) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setIsAuthModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-stone-200">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Connected to Express Backend
              </span>
              <h3 className="text-2xl font-black text-stone-900 mt-1">
                {authMode === 'login' ? 'Sign In To FreshFruit' : 'Create Farm Account'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {authMode === 'login'
                  ? 'Access your orders, saved farms, and cart'
                  : 'Join as a customer or register as a partner grower'}
              </p>
            </div>

            {authMode === 'login' && (
              <div className="mb-4 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Demo Accounts
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    PW: DemoPass123!
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Admin', email: 'admin@freshfruit.demo', color: 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200' },
                    { label: 'Seller', email: 'seller@freshfruit.demo', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200' },
                    { label: 'Customer', email: 'customer@freshfruit.demo', color: 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200' },
                    { label: 'Delivery', email: 'delivery@freshfruit.demo', color: 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' },
                    { label: 'Support', email: 'support@freshfruit.demo', color: 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200' },
                  ].map((demo) => (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => {
                        setAuthFormData({
                          ...authFormData,
                          email: demo.email,
                          password: 'DemoPass123!',
                        });
                        setAuthError('');
                      }}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border text-center transition ${demo.color}`}
                    >
                      {demo.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authFormData.name}
                      onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Account Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthFormData({ ...authFormData, role: 'customer' })}
                        className={`text-xs py-2 rounded-xl font-bold border transition ${
                          authFormData.role === 'customer'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        Buyer / Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthFormData({ ...authFormData, role: 'seller' })}
                        className={`text-xs py-2 rounded-xl font-bold border transition ${
                          authFormData.role === 'seller'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        Farmer / Seller
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authFormData.email}
                  onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                  placeholder="customer@freshfruit.demo"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authFormData.password}
                  onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50"
              >
                {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-stone-500">
              {authMode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError('');
                    }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                    }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
