import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Sprout,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FreshFruitLogo from './FreshFruitLogo';

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  currentUser,
  onLogout,
  onNavigateToAdmin,
  onNavigateToSeller,
  onNavigateToCustomer,
}) {
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#process' },
    { name: 'Products', href: '#produce' },
    { name: 'Contact', href: '#footer' },
  ];

  const handleNavClick = (link) => {
    setActiveTab(link.name);
    setIsMobileMenuOpen(false);

    if (link.href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(link.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md transition-all border-b border-stone-100/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 h-18 sm:h-20 lg:h-22 flex items-center justify-between gap-2 sm:gap-4">
        {/* ============================================================ */}
        {/* LEFT: FreshFruit Market Logo                                  */}
        {/* ============================================================ */}
        <div className="shrink-0">
          <FreshFruitLogo
            variant="header"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>

        {/* ============================================================ */}
        {/* CENTER: Navigation Links (Home, About, Products, Contact)     */}
        {/* ============================================================ */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-stone-50/70 p-1.5 rounded-full border border-stone-200/50">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                type="button"
                onClick={() => handleNavClick(link)}
                className={`relative px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#dcfce7] text-[#15803d] shadow-2xs font-extrabold'
                    : 'text-stone-700 hover:text-[#0e4a29] hover:bg-stone-100/70'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* ============================================================ */}
        {/* RIGHT: Login, Get Started & Basket Controls                   */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Admin shortcut if logged in */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={onNavigateToAdmin}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e4a29] text-[#A3E635] text-xs font-bold shadow-xs hover:bg-[#07361d] transition"
            >
              <Shield className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Admin</span>
            </button>
          )}

          {/* Seller shortcut if logged in */}
          {currentUser?.role === 'seller' && (
            <button
              onClick={onNavigateToSeller}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#15803d] text-white text-xs font-bold shadow-xs hover:bg-[#0e4a29] transition"
            >
              <Sprout className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Seller Hub</span>
            </button>
          )}

          {/* Customer Dashboard shortcut if logged in */}
          {currentUser?.role === 'customer' && (
            <button
              onClick={onNavigateToCustomer}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0e4a29] text-white text-xs font-bold shadow-xs hover:bg-[#07361d] transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Dashboard</span>
            </button>
          )}

          {/* User Session Profile or Login/Get Started */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 bg-[#F6FAF7] pl-2 pr-3 py-1.5 rounded-full border border-stone-200">
              <div className="w-7 h-7 rounded-full bg-[#0e4a29] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#191D1A] max-w-[90px] truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] uppercase font-black text-[#15803d] tracking-wider leading-none">
                  {currentUser.role?.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-stone-400 hover:text-rose-600 transition ml-1 p-0.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
              {/* Login Button (Pill Outline) */}
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-5 sm:px-6 py-2 text-xs sm:text-sm font-bold text-[#0e4a29] bg-white border border-[#0e4a29]/60 hover:border-[#0e4a29] hover:bg-emerald-50/50 rounded-full transition-all cursor-pointer shadow-2xs"
              >
                Login
              </button>

              {/* Get Started Button (Pill Solid Forest Green) */}
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-5 sm:px-6 py-2 text-xs sm:text-sm font-bold text-white bg-[#0e4a29] hover:bg-[#07361d] rounded-full transition-all shadow-md shadow-[#0e4a29]/20 hover:shadow-lg cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Wishlist Button */}
          {wishlistCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onOpenWishlist}
              className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600 transition shadow-2xs cursor-pointer"
              title="Saved Items"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black rounded-full px-1.5 py-0.2 text-[9px] leading-none">
                {wishlistCount}
              </span>
            </motion.button>
          )}

          {/* Shopping Basket Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#0e4a29] hover:bg-[#07361d] text-white shadow-md shadow-[#0e4a29]/25 transition cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#A3E635]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#A3E635] text-stone-950 font-black rounded-full px-1.5 py-0.5 text-[10px] leading-none shadow-xs">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-stone-200 bg-white px-5 pt-4 pb-6 space-y-4 overflow-hidden shadow-lg"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`text-left px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    activeTab === link.name
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
              {currentUser ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0e4a29] text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                      <p className="text-[10px] text-stone-500 uppercase">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-xs font-bold text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-[#0e4a29] border border-[#0e4a29] rounded-xl hover:bg-emerald-50"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#0e4a29] rounded-xl hover:bg-[#07361d]"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
