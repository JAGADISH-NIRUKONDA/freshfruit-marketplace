import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const demoAccounts = [
    { label: 'Admin', email: 'admin@freshfruit.demo', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { label: 'Seller', email: 'seller@freshfruit.demo', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { label: 'Customer', email: 'customer@freshfruit.demo', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { label: 'Delivery', email: 'delivery@freshfruit.demo', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Support', email: 'support@freshfruit.demo', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  ];

  const handleSelectDemo = (email) => {
    setFormData({
      ...formData,
      email,
      password: 'DemoPass123!',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_BASE = 'http://localhost:5000/api/v1';
    const endpoint = mode === 'login' ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    const payload =
      mode === 'login'
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
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
        onSuccess(data.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-stone-200 text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-xl hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#008C60] mx-auto flex items-center justify-center text-white mb-2 shadow-md shadow-[#008C60]/20">
            <Leaf className="w-6 h-6 text-[#A3E635]" />
          </div>
          <h3 className="text-xl font-black text-stone-900">
            {mode === 'login' ? 'Sign In To FreshFruit' : 'Create Farm Account'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {mode === 'login'
              ? 'Access orders, wishlist, and harvest updates'
              : 'Join as a customer or register as an organic grower'}
          </p>
        </div>

        {/* Demo Accounts Quick-Select Buttons */}
        {mode === 'login' && (
          <div className="mb-4 p-3 rounded-2xl bg-[#F6FAF7] border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                1-Click Demo Accounts
              </span>
              <span className="text-[10px] font-mono text-stone-500">
                PW: DemoPass123!
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleSelectDemo(demo.email)}
                  className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border text-center transition cursor-pointer ${demo.color}`}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#008C60] focus:ring-1 focus:ring-[#008C60] outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@domain.com"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#008C60] focus:ring-1 focus:ring-[#008C60] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#008C60] focus:ring-1 focus:ring-[#008C60] outline-hidden"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`text-xs font-bold py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                    formData.role === 'customer'
                      ? 'bg-[#008C60] text-white border-[#008C60]'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  Customer Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`text-xs font-bold py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                    formData.role === 'seller'
                      ? 'bg-[#008C60] text-white border-[#008C60]'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  Farmer / Grower
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#008C60] hover:bg-[#075B43] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50 mt-2 shadow-md shadow-[#008C60]/20 cursor-pointer"
          >
            {loading ? 'Verifying...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-stone-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-[#008C60] font-bold hover:underline cursor-pointer"
              >
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-[#008C60] font-bold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

