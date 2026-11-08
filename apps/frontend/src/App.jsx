import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Shield } from 'lucide-react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import ProductGrid from './components/ProductGrid';
import FeaturedOrchard from './components/FeaturedOrchard';
import MeetFarmers from './components/MeetFarmers';
import FarmProcess from './components/FarmProcess';
import SellerCtaSection from './components/SellerCtaSection';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import WishlistDrawer from './components/WishlistDrawer';
import FarmerStorefrontModal from './components/FarmerStorefrontModal';
import { marketplaceApi } from './services/marketplaceApi';

// Lazy-loaded administrative, seller, and authentication suites to optimize customer landing bundle size
const SellerDashboard = React.lazy(() => import('./seller/SellerDashboard'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));
const LoginPage = React.lazy(() => import('./components/LoginPage'));
const CustomerDashboard = React.lazy(() => import('./customer/CustomerDashboard'));

const DashboardSuspense = ({ children, message = 'Loading workspace...' }) => (
  <React.Suspense
    fallback={
      <div className="min-h-screen bg-[#075B43] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-3 border-[#A3E635] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-widest text-emerald-200 uppercase">
          {message}
        </p>
      </div>
    }
  >
    {children}
  </React.Suspense>
);

const API_BASE = 'http://localhost:5000/api/v1';

// Fallback products in case of initial network cold-start
const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    _id: 'prod-1',
    name: 'Himachal Royal Gala Apples',
    category: 'fruits',
    farm: 'Sharma Alpine Orchards, Shimla',
    price: 180,
    discountPrice: 160,
    originalPrice: 220,
    unit: '1 kg box',
    rating: 4.9,
    reviews: 128,
    harvestDate: 'Harvested Today',
    inStock: 35,
    grade: 'A+',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    description: 'Crisp, sweet, and handpicked from high-altitude chemical-free orchards in Himachal Pradesh.',
  },
  {
    id: 'prod-2',
    _id: 'prod-2',
    name: 'Ratnagiri Alphonso Mangoes',
    category: 'tropical',
    farm: 'Konkan Heritage Agro, Ratnagiri',
    price: 750,
    discountPrice: 699,
    originalPrice: 900,
    unit: 'Dozen (12 pcs)',
    rating: 5.0,
    reviews: 240,
    harvestDate: 'Naturally Ripened',
    inStock: 8,
    grade: 'A',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    description: 'GI-tagged authentic Ratnagiri Hapus with rich saffron pulp and unforgettable sweet aroma.',
  },
  {
    id: 'prod-3',
    _id: 'prod-3',
    name: 'Nagpur Organic Juicy Mandarins',
    category: 'citrus',
    farm: 'Vidarbha Citrus Cooperative, Nagpur',
    price: 120,
    discountPrice: 105,
    originalPrice: 150,
    unit: '1 kg net bag',
    rating: 4.8,
    reviews: 94,
    harvestDate: 'Fresh Picked',
    inStock: 42,
    grade: 'A',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    description: 'Bursting with tangy-sweet natural juice, pesticide-free, and sun-ripened on black soil.',
  },
  {
    id: 'prod-4',
    _id: 'prod-4',
    name: 'Mahabaleshwar Crimson Strawberries',
    category: 'berries',
    farm: 'Sahyadri Berry Valley, Mahabaleshwar',
    price: 210,
    discountPrice: 195,
    originalPrice: 260,
    unit: '500g punnet',
    rating: 4.9,
    reviews: 182,
    harvestDate: 'Air-Delivered Daily',
    inStock: 14,
    grade: 'A',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    description: 'Plump ruby red berries packed with antioxidants and zero synthetic waxing.',
  },
  {
    id: 'prod-5',
    _id: 'prod-5',
    name: 'Nashik Organic Thompson Seedless Grapes',
    category: 'berries',
    farm: 'Godavari Bio-Vines, Nashik',
    price: 140,
    discountPrice: 125,
    originalPrice: 180,
    unit: '1 kg carton',
    rating: 4.7,
    reviews: 76,
    harvestDate: 'Morning Harvest',
    inStock: 28,
    grade: 'A',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=800&q=80',
    description: 'Crisp green seedless table grapes nourished with organic bio-fertilizer and zero chemical spray.',
  },
  {
    id: 'prod-6',
    _id: 'prod-6',
    name: 'Kashmir Golden Delicious Apples',
    category: 'fruits',
    farm: 'Chinar Valley Farms, Srinagar',
    price: 220,
    discountPrice: 199,
    originalPrice: 270,
    unit: '1 kg box',
    rating: 4.9,
    reviews: 110,
    harvestDate: 'Hand-Selected',
    inStock: 19,
    grade: 'A+',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe0a?auto=format&fit=crop&w=800&q=80',
    description: 'Silky smooth golden apples with honeyed sweetness and floral finish.',
  },
  {
    id: 'prod-7',
    _id: 'prod-7',
    name: 'Coorg Hass Fresh Avocados',
    category: 'tropical',
    farm: 'Western Ghats Agro, Coorg',
    price: 320,
    discountPrice: 289,
    originalPrice: 380,
    unit: '500g (2-3 pcs)',
    rating: 4.8,
    reviews: 64,
    harvestDate: 'Tree-Matured',
    inStock: 16,
    grade: 'A',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    description: 'Buttery, rich in healthy fats, shade-grown under organic coffee canopies.',
  },
  {
    id: 'prod-8',
    _id: 'prod-8',
    name: 'Family Organic Harvest Basket',
    category: 'baskets',
    farm: 'FreshFruit Grower Collective',
    price: 650,
    discountPrice: 599,
    originalPrice: 850,
    unit: '5 kg Assorted Box',
    rating: 5.0,
    reviews: 310,
    harvestDate: 'Curated Daily',
    inStock: 25,
    grade: 'A+',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    description: 'A vibrant weekly variety of seasonal apples, citrus, table grapes, and tropical bananas.',
  },
  {
    id: 'prod-9',
    _id: 'prod-9',
    name: 'Nilgiri Organic Sweet Carrots',
    category: 'vegetables',
    farm: 'Nilgiri Mountain Growers, Ooty',
    price: 90,
    discountPrice: 75,
    originalPrice: 110,
    unit: '1 kg bunch',
    rating: 4.8,
    reviews: 58,
    harvestDate: 'Harvested Yesterday',
    inStock: 30,
    grade: 'A',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    description: 'Sweet, earthy, and crunchy mountain carrots pulled from nutrient-rich organic red soil.',
  },
  {
    id: 'prod-10',
    _id: 'prod-10',
    name: 'Hydroponic Tender Baby Spinach',
    category: 'greens',
    farm: 'Sahyadri Greenhouses, Pune',
    price: 80,
    discountPrice: 65,
    originalPrice: 95,
    unit: '250g box',
    rating: 4.9,
    reviews: 92,
    harvestDate: 'Picked at Dawn',
    inStock: 22,
    grade: 'A+',
    isOrganic: true,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    description: 'Tender baby spinach leaves cultivated in mineral water with zero synthetic pesticide sprays.',
  },
];

export default function App() {
  // Navigation & Routing state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Landing Page Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('rating');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [isFarmerStorefrontOpen, setIsFarmerStorefrontOpen] = useState(false);

  // Persistent Basket & Wishlist
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfruit_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('freshfruit_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('freshfruit_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('freshfruit_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Real-time Backend Health Monitor
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    dbStatus: 'unknown',
    uptime: 0,
    version: '',
  });

  const checkHealth = useCallback(async () => {
    try {
      const json = await marketplaceApi.getHealth();
      setBackendHealth({
        status: 'online',
        dbStatus: json.data?.database?.status || 'connected',
        uptime: json.data?.uptimeSeconds || 0,
        version: json.data?.version || '1.0.0',
      });
    } catch {
      setBackendHealth({ status: 'offline', dbStatus: 'disconnected', uptime: 0, version: '' });
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Synchronize browser history / URL path
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

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
        })
        .finally(() => {
          setAuthChecking(false);
        });
    } else {
      setAuthChecking(false);
    }
  }, []);

  // Fetch Live Produce from MongoDB
  const loadMarketplaceData = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const [productsData, categoriesData, farmersData, reviewsData] = await Promise.all([
        marketplaceApi.getProducts({
          category: selectedCategory,
          search: searchQuery,
          sort: sortOption,
        }).catch(() => null),
        marketplaceApi.getCategories().catch(() => null),
        marketplaceApi.getFarmers().catch(() => null),
        marketplaceApi.getReviews().catch(() => null),
      ]);

      if (productsData?.products?.length > 0) {
        setProducts(productsData.products);
      } else if (!searchQuery && selectedCategory === 'all') {
        setProducts(FALLBACK_PRODUCTS);
      } else {
        setProducts([]);
      }

      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      }
      if (farmersData && farmersData.length > 0) {
        setFarmers(farmersData);
      }
      if (reviewsData && reviewsData.length > 0) {
        setReviews(reviewsData);
      }
    } catch (err) {
      console.warn('Marketplace fetch fallback:', err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategory, searchQuery, sortOption]);

  useEffect(() => {
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  // Shopping Cart Actions with Stock Verification
  const handleAddToCart = (product) => {
    const stockAvailable = typeof product.inStock === 'number' ? product.inStock : 50;
    if (stockAvailable <= 0) {
      showToast(`Sorry, ${product.name} is sold out!`);
      return;
    }

    const qtyToAdd = product.quantity || 1;
    let reachedLimit = false;

    setCart((prev) => {
      const pId = product.id || product._id;
      const existing = prev.find((item) => (item.id || item._id) === pId);
      if (existing) {
        const potentialQty = existing.quantity + qtyToAdd;
        if (potentialQty > stockAvailable) {
          reachedLimit = true;
          return prev.map((item) =>
            (item.id || item._id) === pId ? { ...item, quantity: stockAvailable } : item
          );
        }
        return prev.map((item) =>
          (item.id || item._id) === pId ? { ...item, quantity: potentialQty } : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(qtyToAdd, stockAvailable) }];
    });

    if (reachedLimit) {
      showToast(`Maximum harvest limit reached (${stockAvailable} available)`);
    } else {
      showToast(`Added ${product.name} to basket!`);
    }
  };

  const handleUpdateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.id || item._id) === id) {
            const stockAvailable = typeof item.inStock === 'number' ? item.inStock : 50;
            const newQty = item.quantity + delta;
            if (newQty > stockAvailable) {
              showToast(`Only ${stockAvailable} available in orchard stock`);
              return { ...item, quantity: stockAvailable };
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  const handleCheckout = () => {
    showToast('Demo order registered! Cold-chain dispatch scheduled.');
    setCart([]);
    setIsCartOpen(false);
  };

  // Wishlist Actions
  const handleToggleWishlist = (id) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from wishlist');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to wishlist!');
        return [...prev, id];
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('freshfruit_jwt');
    setCurrentUser(null);
    showToast('Signed out successfully');
  };

  // Category selection handler with smooth scroll to produce catalog
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const produceEl = document.getElementById('produce');
    if (produceEl) {
      produceEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Farmer Storefront modal by ID or farm name
  const handleOpenFarmerStorefront = (idOrName) => {
    if (!idOrName) return;
    if (typeof idOrName === 'string' && idOrName.match(/^[0-9a-fA-F]{24}$/)) {
      setSelectedFarmerId(idOrName);
      setIsFarmerStorefrontOpen(true);
      return;
    }
    const matched = farmers.find(
      (f) =>
        f.farmName?.toLowerCase().includes(String(idOrName).toLowerCase()) ||
        f.farmerName?.toLowerCase().includes(String(idOrName).toLowerCase())
    );
    if (matched) {
      setSelectedFarmerId(matched.id || matched._id);
    } else if (farmers.length > 0) {
      setSelectedFarmerId(farmers[0].id || farmers[0]._id);
    }
    setIsFarmerStorefrontOpen(true);
  };

  // ROUTING GUARDS FOR SELLER
  if (currentPath.startsWith('/seller')) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#075B43] flex flex-col items-center justify-center text-white font-sans">
          <div className="w-10 h-10 border-3 border-[#A3E635] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold tracking-widest text-emerald-200 uppercase">
            Verifying Seller Credentials...
          </p>
        </div>
      );
    }

    if (currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin')) {
      return (
        <DashboardSuspense message="Launching Farmer & Seller Portal...">
          <SellerDashboard
            sellerUser={currentUser}
            onLogout={() => {
              handleLogout();
              navigateTo('/');
            }}
            onExitToMarketplace={() => navigateTo('/')}
          />
        </DashboardSuspense>
      );
    }

    return (
      <div className="min-h-screen bg-[#F6FAF7] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-[#008C60] flex items-center justify-center text-white mx-auto mb-4 shadow-xl">
          <Shield className="w-8 h-8 text-[#A3E635]" />
        </div>
        <h2 className="text-2xl font-black text-[#191D1A]">Farmer & Seller Access Required</h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mt-2 mb-6">
          Please sign in with a registered seller account to access your orchard dashboard and harvest management controls.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigateTo('/')}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            Return Home
          </button>
          <button
            onClick={() => navigateTo('/login')}
            className="px-5 py-2.5 rounded-xl bg-[#008C60] text-white text-xs font-bold hover:bg-[#075B43] shadow-md cursor-pointer"
          >
            Sign In as Seller
          </button>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome ${user.name}!`);
            if (user.role === 'seller' || user.role === 'admin') {
              navigateTo('/seller/dashboard');
            } else {
              navigateTo('/');
            }
          }}
        />
      </div>
    );
  }

  // ROUTING GUARDS FOR ADMIN
  if (authChecking && currentPath.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-[#075B43] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-3 border-[#A3E635] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-widest text-emerald-200 uppercase">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (currentPath === '/admin/login') {
    return (
      <DashboardSuspense message="Loading Admin Gateway...">
        <AdminLogin
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            navigateTo('/admin/dashboard');
          }}
          onExitToMarketplace={() => navigateTo('/')}
        />
      </DashboardSuspense>
    );
  }

  if (currentPath.startsWith('/admin')) {
    if (currentUser && currentUser.role === 'admin') {
      return (
        <DashboardSuspense message="Initializing Executive Command Center...">
          <AdminDashboard
            adminUser={currentUser}
            onLogout={() => {
              handleLogout();
              navigateTo('/admin/login');
            }}
            onExitToMarketplace={() => navigateTo('/')}
          />
        </DashboardSuspense>
      );
    }
    return (
      <DashboardSuspense message="Loading Admin Gateway...">
        <AdminLogin
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            navigateTo('/admin/dashboard');
          }}
          onExitToMarketplace={() => navigateTo('/')}
        />
      </DashboardSuspense>
    );
  }

  // ROUTING GUARDS FOR CUSTOMER DASHBOARD
  if (currentPath.startsWith('/customer') || currentPath === '/dashboard') {
    return (
      <DashboardSuspense message="Launching FreshFruit Customer Dashboard...">
        <CustomerDashboard
          customerUser={currentUser || { name: 'Jagadish', email: 'customer@freshfruit.demo', role: 'customer' }}
          onLogout={() => {
            handleLogout();
            navigateTo('/');
          }}
          onExitToMarketplace={() => navigateTo('/')}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateCartQuantity={handleUpdateQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      </DashboardSuspense>
    );
  }

  // EXACT FULL-SCREEN SPLIT-SCREEN LOGIN PAGE
  if (currentPath === '/login') {
    return (
      <DashboardSuspense message="Loading FreshFruit Market...">
        <LoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome back, ${user.name}!`);
            if (user.role === 'admin') {
              navigateTo('/admin/dashboard');
            } else if (user.role === 'seller') {
              navigateTo('/seller/dashboard');
            } else {
              navigateTo('/customer/dashboard');
            }
          }}
          onNavigateHome={() => navigateTo('/')}
          onNavigateToRegister={() => {
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
            navigateTo('/');
          }}
          initialRole="customer"
        />
      </DashboardSuspense>
    );
  }

  // CUSTOMER-FACING LANDING PAGE
  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#191D1A] flex flex-col font-sans selection:bg-[#008C60]/20 selection:text-[#075B43]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#075B43] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-600/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#A3E635]" />
          <span className="font-bold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Premium Navigation Bar (Single top bar matching reference design) */}
      <Navbar
        cartCount={cart.reduce((sum, i) => sum + (i.quantity || 1), 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => navigateTo('/login')}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateToAdmin={() =>
          navigateTo(currentUser?.role === 'admin' ? '/admin/dashboard' : '/admin/login')
        }
        onNavigateToSeller={() => navigateTo('/seller/dashboard')}
        onNavigateToCustomer={() => navigateTo('/customer/dashboard')}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* Hero Section matching reference design */}
        <HeroSection
          onShopHarvest={() => {
            const produceEl = document.getElementById('produce');
            if (produceEl) produceEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onBecomeGrower={() => {
            const sellerEl = document.getElementById('seller-cta');
            if (sellerEl) sellerEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* D. Harvest Categories */}
        <CategorySection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* E. Today's Fresh Harvest (Live Product Grid from MongoDB) */}
        <ProductGrid
          products={products}
          loading={loadingProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          sortOption={sortOption}
          onSortChange={setSortOption}
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onRefresh={loadMarketplaceData}
          onOpenDetails={(product) => {
            setSelectedProduct(product);
            setIsDetailsOpen(true);
          }}
          onOpenFarmerStorefront={handleOpenFarmerStorefront}
        />

        {/* F. Featured Orchard Spotlight */}
        <FeaturedOrchard
          onExploreFarm={(farmName) => {
            setSearchQuery(farmName);
            const produceEl = document.getElementById('produce');
            if (produceEl) produceEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenFarmerStorefront={handleOpenFarmerStorefront}
        />

        {/* G. Meet Our Farmers */}
        <MeetFarmers
          farmers={farmers}
          onExploreFarmerProducts={(name) => {
            setSearchQuery(name);
            const produceEl = document.getElementById('produce');
            if (produceEl) produceEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenFarmerStorefront={handleOpenFarmerStorefront}
        />

        {/* H. Farm-to-Door Process */}
        <FarmProcess />

        {/* Seller Call To Action */}
        <SellerCtaSection
          onRegisterGrower={() => {
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
          }}
        />

        {/* I. Customer Testimonials */}
        <Testimonials reviews={reviews} />

        {/* J. Newsletter Section */}
        <Newsletter />
      </main>

      {/* K. Professional Footer */}
      <Footer
        onNavigateToAdmin={() =>
          navigateTo(currentUser?.role === 'admin' ? '/admin/dashboard' : '/admin/login')
        }
        onCategoryClick={(cat) => handleSelectCategory(cat)}
      />

      {/* Slide-in Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Slide-in Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onRemoveItem={handleToggleWishlist}
        onMoveToBasket={(product) => {
          handleAddToCart(product);
          handleToggleWishlist(product.id || product._id);
        }}
        onOpenDetails={(product) => {
          setIsWishlistOpen(false);
          setSelectedProduct(product);
          setIsDetailsOpen(true);
        }}
      />

      {/* Rich Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        isWishlisted={wishlist.includes(selectedProduct?.id || selectedProduct?._id)}
        onToggleWishlist={handleToggleWishlist}
        onOpenFarmerStorefront={handleOpenFarmerStorefront}
      />

      {/* Customer Farmer Storefront Modal */}
      <FarmerStorefrontModal
        farmerId={selectedFarmerId}
        isOpen={isFarmerStorefrontOpen}
        onClose={() => {
          setIsFarmerStorefrontOpen(false);
          setSelectedFarmerId(null);
        }}
        onOpenProductDetails={(prod) => {
          setSelectedProduct(prod);
          setIsDetailsOpen(true);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Auth Modal (Sign In / Register / 1-Click Demos) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome ${user.name || 'back'}!`);
        }}
      />
    </div>
  );
}
