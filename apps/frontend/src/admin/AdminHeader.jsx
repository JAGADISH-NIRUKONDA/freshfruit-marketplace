import React from 'react';
import {
  Bell,
  Search,
  RefreshCw,
  User,
  Shield,
  ExternalLink,
  Menu,
} from 'lucide-react';

export default function AdminHeader({
  activeTabTitle,
  adminUser,
  onRefresh,
  isRefreshing,
  onExitToMarketplace,
  onToggleMobileSidebar,
}) {
  return (
    <header className="h-20 bg-white border-b border-stone-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Enterprise Dashboard
            </span>
          </div>
          <h1 className="text-xl font-black text-stone-900 tracking-tight leading-tight mt-0.5">
            {activeTabTitle}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition flex items-center gap-1.5 text-xs font-semibold"
          title="Refresh real-time data from MongoDB"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync DB</span>
        </button>

        {/* View Marketplace Button */}
        <button
          onClick={onExitToMarketplace}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          <span>Live Store</span>
        </button>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {adminUser?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-stone-900 leading-none">
              {adminUser?.name || 'Administrator'}
            </div>
            <div className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider flex items-center gap-1 mt-0.5">
              <Shield className="w-2.5 h-2.5" />
              <span>{adminUser?.role || 'SUPER ADMIN'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

