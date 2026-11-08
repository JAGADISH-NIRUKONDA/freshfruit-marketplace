import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Store,
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  CreditCard,
  Star,
  Tag,
  Bell,
  Headphones,
  LogOut,
  Search,
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  User,
  Sprout,
  Sparkles,
} from 'lucide-react';
import FreshFruitLogo from '../components/FreshFruitLogo';
import { customerApi } from '../services/customerApi';
import DashboardOverviewView from './views/DashboardOverviewView';
import ShopProductsView from './views/ShopProductsView';
import MyOrdersView from './views/MyOrdersView';
import WishlistView from './views/WishlistView';
import CartCheckoutView from './views/CartCheckoutView';
import AddressesView from './views/AddressesView';
import PaymentsView from './views/PaymentsView';
import ReviewsView from './views/ReviewsView';
import OffersView from './views/OffersView';
import NotificationsView from './views/NotificationsView';
import HelpSupportView from './views/HelpSupportView';

export default function CustomerDashboard({
  customerUser,
  onLogout,
  onExitToMarketplace,
  initialTab = 'dashboard',
  cart = [],
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  wishlist = [],
  onToggleWishlist,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [headerSearch, setHeaderSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Sync / Load customer stats from API
  const refreshStats = async () => {
    try {
      const data = await customerApi.getDashboardStats();
      if (data) {
        setStatsData(data);
      }
    } catch (err) {
      console.warn('Dashboard stats fallback:', err.message);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const customerName =
    customerUser?.name?.split(' ')[0] || statsData?.customer?.name?.split(' ')[0] || 'Jagadish';

  // Live cart count calculation
  const totalCartCount =
    cart.reduce((sum, item) => sum + (item.quantity || 1), 0) || statsData?.stats?.cartItems || 3;

  const totalWishlistCount =
    wishlist.length || statsData?.stats?.wishlistItems || 8;

  // Handle header search submit
  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      setActiveTab('shop');
    }
  };

  // Nav Items definition exactly matching the screenshot
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shop', label: 'Shop Products', icon: Store },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: totalWishlistCount },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: totalCartCount, badgeColor: 'bg-orange-500' },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'notifications', label: 'Notifications', icon: Bell, dot: true },
    { id: 'support', label: 'Help & Support', icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-[#f4f8f5] flex font-sans text-stone-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ========================================================= */}
      {/* LEFT SIDEBAR (Dark Forest Green #0a3d24)                 */}
      {/* ========================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a3d24] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl lg:shadow-none`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          {/* Brand Logo Header */}
          <div className="p-5 flex items-center justify-between border-b border-emerald-900/60">
            <div
              onClick={() => {
                setActiveTab('dashboard');
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className="cursor-pointer"
            >
              <FreshFruitLogo variant="light" size="default" />
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#ebf7ee] text-[#0a3d24] shadow-sm font-extrabold'
                      : 'text-emerald-100/90 hover:bg-emerald-900/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-[#0a3d24] stroke-[2.5]' : 'text-emerald-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Live Badge for Cart or Wishlist */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${
                          item.badgeColor || 'bg-emerald-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Dot indicator for Notifications */}
                    {item.dot && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    )}

                    {/* Chevron for Active tab */}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#0a3d24] stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Illustration: Delivery Agent on Scooter & Waves */}
        <div className="relative pt-2 overflow-hidden border-t border-emerald-900/40 select-none">
          {/* Logout Button */}
          <div className="px-3 pb-2">
            <button
              onClick={() => {
                if (onLogout) onLogout();
                else if (onExitToMarketplace) onExitToMarketplace();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-emerald-200/90 hover:text-rose-200 hover:bg-rose-950/40 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Delivery Partner on Scooter Vector Art matching reference image */}
          <div className="relative h-28 px-4 flex items-end justify-center">
            {/* Rolling Hills Background Waves */}
            <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none opacity-40">
              <svg viewBox="0 0 200 60" fill="none" className="w-full h-full preserve-3d">
                <path
                  d="M0 35C40 20 80 50 120 30C160 10 180 25 200 20V60H0V35Z"
                  fill="#052c1a"
                />
                <path
                  d="M0 45C50 35 100 55 150 40C180 30 195 35 200 32V60H0V45Z"
                  fill="#031e11"
                />
              </svg>
            </div>

            {/* Scooter with Delivery Driver SVG */}
            <div className="relative z-10 mb-1 flex items-center justify-center transform hover:scale-105 transition duration-300">
              <svg
                width="140"
                height="80"
                viewBox="0 0 140 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Rolling green road curve */}
                <path
                  d="M0 68C30 64 70 66 140 68"
                  stroke="#15803d"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M10 72C40 69 80 71 130 72"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Delivery Scooter */}
                {/* Back Wheel */}
                <circle cx="34" cy="58" r="11" fill="#1f2937" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="34" cy="58" r="4" fill="#e5e7eb" />

                {/* Front Wheel */}
                <circle cx="98" cy="58" r="11" fill="#1f2937" stroke="#9ca3af" strokeWidth="2" />
                <circle cx="98" cy="58" r="4" fill="#e5e7eb" />

                {/* Scooter Body (Bright Yellow/Orange) */}
                <path
                  d="M32 58L46 48L64 48L76 56L94 56"
                  stroke="#eab308"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Floorboard */}
                <path d="M50 56H72" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />

                {/* Handlebar Column */}
                <path d="M86 52L82 32L78 32" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
                <circle cx="78" cy="32" r="2.5" fill="#111827" />

                {/* Delivery Box at Rear (White with FreshFruit Leaf) */}
                <rect
                  x="16"
                  y="30"
                  width="22"
                  height="18"
                  rx="3"
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                {/* Tiny green fruit logo on box */}
                <path d="M24 39C24 36 29 34 30 38C28 42 24 41 24 39Z" fill="#16a34a" />
                <circle cx="28" cy="38" r="2" fill="#ea580c" />

                {/* Delivery Partner Character */}
                {/* Body (Green Jacket) */}
                <path d="M60 48L64 34L72 34L74 46" fill="#15803d" />
                {/* Arms holding handlebar */}
                <path d="M66 36L78 34" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />

                {/* Head with Green Cap */}
                <circle cx="68" cy="24" r="5" fill="#fed7aa" />
                <path
                  d="M63 23C63 20 68 18 73 20L77 22H63V23Z"
                  fill="#166534"
                />
              </svg>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ========================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger + "Customer Dashboard" Heading */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Sprout className="w-5 h-5" />
              </div>
              <h1 className="text-base sm:text-lg font-black text-stone-900 tracking-tight hidden sm:block">
                Customer Dashboard
              </h1>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <form
            onSubmit={handleHeaderSearchSubmit}
            className="flex-1 max-w-md hidden md:block"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search for fruits, vegetables, and more..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#f8faf8] border border-stone-200/80 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>
          </form>

          {/* Right: Icons + User Profile Chip */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Wishlist Icon */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-rose-600 transition cursor-pointer"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-emerald-800 transition cursor-pointer"
              title="View Cart & Checkout"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-stone-200 hidden sm:block" />

            {/* User Profile Chip: "Hi, Jagadish" */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-stone-100 border border-stone-200/80 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#0a3d24] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-stone-800">Hi, {customerName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 text-xs text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="font-bold text-stone-900">{customerUser?.name || 'Jagadish'}</p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {customerUser?.email || 'customer@freshfruit.demo'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 font-semibold cursor-pointer"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('addresses');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 font-semibold cursor-pointer"
                  >
                    Saved Addresses
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('support');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 font-semibold cursor-pointer"
                  >
                    Help & Support
                  </button>
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onExitToMarketplace) onExitToMarketplace();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-[#0a3d24] font-bold cursor-pointer"
                  >
                    Back to Store
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* BODY CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverviewView
              statsData={statsData}
              customerName={customerName}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlistIds={wishlist}
              onOpenProductDetails={(prod) => {
                setActiveTab('shop');
              }}
            />
          )}

          {activeTab === 'shop' && (
            <ShopProductsView
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlistIds={wishlist}
              onOpenProductDetails={(prod) => {
                // handle detail
              }}
            />
          )}

          {activeTab === 'orders' && (
            <MyOrdersView
              onReorder={(order) => {
                order.items?.forEach((item) => {
                  if (onAddToCart) onAddToCart(item);
                });
                setActiveTab('cart');
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'wishlist' && (
            <WishlistView
              onMoveToCart={(product) => {
                if (onAddToCart) onAddToCart(product);
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'cart' && (
            <CartCheckoutView
              cartItems={cart}
              onUpdateQuantity={onUpdateCartQuantity}
              onRemoveItem={onRemoveFromCart}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOrderSuccess={async () => {
                await refreshStats();
              }}
            />
          )}

          {activeTab === 'addresses' && <AddressesView />}

          {activeTab === 'payments' && (
            <PaymentsView onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'reviews' && <ReviewsView />}

          {activeTab === 'offers' && (
            <OffersView onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'notifications' && <NotificationsView />}

          {activeTab === 'support' && <HelpSupportView />}
        </main>
      </div>
    </div>
  );
}
