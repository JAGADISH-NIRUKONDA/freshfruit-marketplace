import React, { useState } from 'react';
import { Leaf, Lock, Mail, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { adminApi } from './adminApi';

export default function AdminLogin({ onLoginSuccess, onExitToMarketplace }) {
  const [email, setEmail] = useState('admin@freshfruit.demo');
  const [password, setPassword] = useState('DemoPass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await adminApi.login(email, password);
      if (data.user?.role !== 'admin') {
        throw new Error('Access denied. Administrator privileges required to access the Admin Portal.');
      }
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1f16] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background imagery */}
      <img
        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80"
        alt="Orchard background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f16]/90 via-[#0f2d21]/95 to-[#081710]" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-900/30 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-700/30">
            <Leaf className="w-8 h-8 text-lime-300" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            FreshFruit<span className="text-emerald-600">.</span> Admin
          </h2>
          <p className="text-xs text-stone-500">
            Enterprise Management & Marketplace Operations
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Quick-Fill Pill */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-extrabold text-emerald-900 block">Verified Demo Admin</span>
            <span className="text-[11px] text-emerald-700 font-mono">admin@freshfruit.demo</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@freshfruit.demo');
              setPassword('DemoPass123!');
              setError('');
            }}
            className="text-[10px] uppercase font-black px-2.5 py-1 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
          >
            Auto Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@freshfruit.demo"
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onExitToMarketplace}
            className="text-xs text-stone-500 hover:text-emerald-700 transition flex items-center justify-center gap-1 mx-auto font-semibold"
          >
            <span>Back to Public Marketplace</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

