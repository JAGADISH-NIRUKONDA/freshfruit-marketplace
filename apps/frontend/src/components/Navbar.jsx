import React, { useState } from 'react';
import {
  Leaf,
  Search,
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenAuth,
  currentUser,
  onLogout,
  onNavigateToAdmin,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-11 h-11 rounded-2xl bg-[#008C60] flex items-center justify-center text-white shadow-md shadow-[#008C60]/25"
          >
            <Leaf className="w-6 h-6 text-[#A3E635]" />
          </motion.div>
          <div>
            <span className="text-2xl font-black tracking-tight text-[#191D1A] block leading-none">
              FreshFruit<span className="text-[#008C60]">.</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-stone-500 block">
              Organic Direct
            </span>
          </div>
        </a>

        {/* Global Product Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mangoes, apples, berries, partner orchards..."
              className="w-full bg-[#F6FAF7] hover:bg-stone-100 focus:bg-white text-xs sm:text-sm text-[#191D1A] rounded-full pl-11 pr-10 py-2.5 border border-stone-200 focus:border-[#008C60] focus:ring-2 focus:ring-[#008C60]/20 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-700">
          <a
            href="#produce"
            className="hover:text-[#008C60] transition relative group py-1"
          >
            Harvest Catalog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008C60] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#process"
            className="hover:text-[#008C60] transition relative group py-1"
          >
            Why Direct
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008C60] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#farmers"
            className="hover:text-[#008C60] transition relative group py-1"
          >
            Meet Farmers
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008C60] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#seller-cta"
            className="text-[#008C60] hover:text-[#075B43] font-bold transition flex items-center gap-1"
          >
            Sell Produce
          </a>
        </nav>

        {/* User Account, Admin Gateway, Wishlist & Basket */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Dashboard shortcut when logged in as admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={onNavigateToAdmin}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#075B43] text-[#A3E635] text-xs font-bold border border-emerald-600/40 hover:bg-[#008C60] hover:text-white transition shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Admin</span>
            </button>
          )}

          {/* User Account / Auth */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 bg-[#F6FAF7] pl-2 pr-3 py-1.5 rounded-full border border-stone-200">
              <div className="w-7 h-7 rounded-full bg-[#008C60] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#191D1A] max-w-[90px] truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] uppercase font-black text-[#008C60] tracking-wider leading-none">
                  {currentUser.role?.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="text-stone-400 hover:text-rose-600 transition ml-1 p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-[#F6FAF7] hover:border-[#008C60] hover:text-[#008C60] transition"
            >
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>Sign In</span>
            </button>
          )}

          {/* Shopping Basket Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-[#008C60] hover:bg-[#075B43] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md shadow-[#008C60]/20 hover:shadow-lg transition cursor-pointer"
          >
            <motion.div
              key={cartCount}
              animate={cartCount > 0 ? { scale: [1, 1.25, 0.92, 1.1, 1], rotate: [0, -12, 12, -6, 0] } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <ShoppingBag className="w-4 h-4 text-[#A3E635]" />
            </motion.div>
            <span className="hidden sm:inline">Basket</span>
            {cartCount > 0 && (
              <span className="bg-[#A3E635] text-stone-950 font-black rounded-full px-2 py-0.5 text-[11px] leading-none shadow-xs">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-stone-700 hover:text-stone-900 p-2 rounded-xl hover:bg-stone-100 transition"
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
            className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 overflow-hidden"
          >
            {/* Mobile Search */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fruits, farms, varieties..."
                className="w-full bg-[#F6FAF7] text-xs rounded-full pl-10 pr-4 py-2.5 border border-stone-200 focus:border-[#008C60] outline-hidden"
              />
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2.5 text-sm font-semibold text-stone-700">
              <a
                href="#produce"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 flex items-center justify-between hover:text-[#008C60]"
              >
                <span>Harvest Catalog</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              <a
                href="#process"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 flex items-center justify-between hover:text-[#008C60]"
              >
                <span>Why Direct (Our Process)</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              <a
                href="#farmers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 flex items-center justify-between hover:text-[#008C60]"
              >
                <span>Meet Our Farmers</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
              <a
                href="#seller-cta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 flex items-center justify-between text-[#008C60] font-bold"
              >
                <span>Sell Produce on FreshFruit</span>
                <ChevronRight className="w-4 h-4 text-[#008C60]" />
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateToAdmin();
                }}
                className="py-1.5 flex items-center justify-between text-[#075B43] font-bold"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#008C60]" />
                  Admin Management Portal
                </span>
                <ChevronRight className="w-4 h-4 text-[#075B43]" />
              </button>
            </nav>

            {/* Mobile Auth Button */}
            {!currentUser ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full bg-[#008C60] text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md"
              >
                Sign In / Register
              </button>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#008C60] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-500">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs text-rose-600 font-bold px-3 py-1 rounded-lg border border-rose-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

