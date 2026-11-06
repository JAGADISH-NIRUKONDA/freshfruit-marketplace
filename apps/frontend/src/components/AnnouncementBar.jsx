import React from 'react';
import { RefreshCw, Shield, Sparkles, Clock, CheckCircle } from 'lucide-react';

export default function AnnouncementBar({
  backendHealth,
  onRefreshHealth,
  onNavigateToAdmin,
  currentUser,
}) {
  return (
    <div className="bg-[#075B43] text-emerald-50 text-xs py-2 px-4 border-b border-[#008C60]/30 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left Announcements */}
        <div className="flex items-center flex-wrap justify-center md:justify-start gap-2.5 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-[#A3E635] font-black uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3 text-[#A3E635]" />
            Farm-To-Door
          </span>
          <span className="text-emerald-100/90 font-medium hidden sm:inline">
            Zero chemical wax • 100% Residue-free
          </span>
          <span className="text-emerald-300 hidden lg:inline">•</span>
          <span className="text-emerald-200 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-300" />
            Harvested & dispatched within 24 hours
          </span>
        </div>

        {/* Right Status & Admin Gateway */}
        <div className="flex items-center gap-3">
          {/* Admin shortcut */}
          <button
            onClick={onNavigateToAdmin}
            className="text-emerald-200 hover:text-white font-bold text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/40 transition"
            title="Open Enterprise Admin Operations"
          >
            <Shield className="w-3 h-3 text-[#A3E635]" />
            <span>{currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Admin Portal'}</span>
          </button>

          {/* Backend Health Badge */}
          <div className="flex items-center gap-1.5 bg-[#0a382a] px-2.5 py-1 rounded-md border border-emerald-700/50">
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealth.status === 'online'
                  ? 'bg-[#A3E635] animate-pulse'
                  : backendHealth.status === 'checking'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            />
            <span className="font-mono text-[10px] text-emerald-100">
              API: {backendHealth.status === 'online' ? 'Online' : 'Offline'} | DB:{' '}
              {backendHealth.dbStatus === 'connected' ? 'Connected' : 'Pending'}
            </span>
            <button
              onClick={onRefreshHealth}
              title="Refresh Backend Health"
              className="text-emerald-300 hover:text-white transition ml-0.5"
            >
              <RefreshCw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

