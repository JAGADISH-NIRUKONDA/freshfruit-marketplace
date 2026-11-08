import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  Bell,
  Heart,
  ShoppingCart,
  LogOut,
  ChevronDown,
  User,
  ExternalLink,
  Shield,
  Store,
  Truck,
  Headphones,
} from 'lucide-react';
import FreshFruitLogo from '../FreshFruitLogo';

export default function DashboardLayout({
  user,
  role = 'customer', // 'customer' | 'seller' | 'admin' | 'delivery' | 'support'
  roleTitle = 'Customer',
  navItems = [],
  activeTab,
  onNavigate,
  onLogout,
  onExitToMarketplace,
  title,
  subtitle,
  searchPlaceholder = 'Search anything...',
  onSearch,
  cartCount = 0,
  wishlistCount = 0,
  unreadNotifications = 0,
  children,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const userName = user?.name || user?.farmerName || 'User';
  const userAvatar =
    user?.avatar ||
    user?.profilePhoto ||
    (role === 'admin'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      : role === 'seller'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      : role === 'delivery'
      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      : role === 'support'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
  };

  // Sidebar Component content
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#064E2B] text-white">
      {/* 1. Header with FreshFruit Brand */}
      <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between">
        <div className="cursor-pointer" onClick={onExitToMarketplace}>
          <FreshFruitLogo variant="light" size="sm" />
        </div>
      </div>

      {/* 2. User Profile Badge */}
      <div className="px-5 py-4 border-b border-emerald-900/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400/80 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#064E2B]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate leading-tight">
              {userName}
            </p>
            <p className="text-[11px] font-medium text-emerald-300/80 truncate">
              {roleTitle}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1 scrollbar-thin scrollbar-thumb-emerald-800">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer relative group ${
                isActive
                  ? 'bg-[#16A34A] text-white shadow-sm'
                  : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {Icon && (
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-emerald-300 group-hover:scale-110'
                    }`}
                  />
                )}
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white text-[#16A34A]'
                      : 'bg-[#F97316] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Bottom Section: Delivery Rider Graphic & Exit Links */}
      <div className="p-4 border-t border-emerald-900/60 space-y-2 bg-[#053d21]">
        {/* Delivery Scooter Artwork */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-emerald-900/40 border border-emerald-800/40">
          <div className="text-xl">🛵</div>
          <div className="text-left text-[11px]">
            <p className="font-bold text-emerald-200 leading-tight">Fresh Express</p>
            <p className="text-[10px] text-emerald-400/80">Farm to doorstep</p>
          </div>
        </div>

        <button
          onClick={onExitToMarketplace}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-200/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Exit to Marketplace</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300/80 hover:bg-rose-500/20 hover:text-rose-200 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAF4] font-sans flex text-[#17251C]">
      {/* Desktop Sidebar (Fixed 256px) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 shadow-lg z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200/70 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          {/* Left: Mobile hamburger + Titles */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0 text-left">
              <h1 className="text-base sm:text-lg font-black text-stone-900 truncate tracking-tight">
                {title || 'Dashboard'}
              </h1>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-stone-500 font-medium truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Center: Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-stone-100/80 border border-stone-200/70 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition"
              />
            </div>
          </form>

          {/* Right: Actions & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wishlist Icon */}
            {wishlistCount !== undefined && (
              <button
                onClick={() => onNavigate('wishlist')}
                className="relative p-2 rounded-full text-stone-600 hover:text-rose-600 hover:bg-stone-100 transition cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Shopping Cart Icon */}
            {cartCount !== undefined && (
              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2 rounded-full text-stone-600 hover:text-emerald-700 hover:bg-stone-100 transition cursor-pointer"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 rounded-full text-stone-600 hover:text-amber-600 hover:bg-stone-100 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F97316] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-stone-200/80 hover:bg-stone-50 transition cursor-pointer"
              >
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="hidden sm:inline text-xs font-bold text-stone-800">
                  {userName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-stone-200/80 p-2 z-50 text-left"
                  >
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {userName}
                      </p>
                      <p className="text-[10px] text-stone-500 font-medium">
                        {roleTitle}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onNavigate) onNavigate('profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onExitToMarketplace) onExitToMarketplace();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Marketplace Home</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic View Body with Smooth Stagger Transition */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
