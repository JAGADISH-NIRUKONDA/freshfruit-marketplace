import React, { useState } from 'react';
import {
  Leaf,
  User,
  Store,
  Bike,
  Headphones,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Demo accounts for instant development verification and testing
const DEMO_ACCOUNTS = {
  customer: {
    role: 'customer',
    label: 'Customer',
    email: 'customer@freshfruit.demo',
    icon: User,
  },
  seller: {
    role: 'seller',
    label: 'Seller',
    email: 'seller@freshfruit.demo',
    icon: Store,
  },
  delivery: {
    role: 'delivery_partner',
    label: 'Delivery',
    email: 'delivery@freshfruit.demo',
    icon: Bike,
  },
  support: {
    role: 'support_agent',
    label: 'Support',
    email: 'support@freshfruit.demo',
    icon: Headphones,
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    email: 'admin@freshfruit.demo',
    icon: Shield,
  },
};

const DEFAULT_PASSWORD = 'DemoPass123!';

export default function LoginPage({
  onLoginSuccess,
  onNavigateHome,
  onNavigateToRegister,
  initialRole = 'customer',
}) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoNotice, setInfoNotice] = useState('');

  // When clicking on a role card, switch selected role and auto-fill that role's demo account
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage('');
    const account = DEMO_ACCOUNTS[roleKey];
    if (account) {
      setEmail(account.email);
      setPassword(DEFAULT_PASSWORD);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoNotice('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || (data.errors ? data.errors[0]?.message : 'Invalid email or password.')
        );
      }

      const { user, token } = data.data;

      // Secure token persistence according to Remember Me
      if (token) {
        if (rememberMe) {
          localStorage.setItem('freshfruit_jwt', token);
        } else {
          sessionStorage.setItem('freshfruit_jwt', token);
          localStorage.removeItem('freshfruit_jwt');
        }
      }

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      console.error('[Login Error]', err);
      setErrorMessage(err.message || 'Unable to connect to the authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = (provider) => {
    setInfoNotice(
      `${provider} OAuth is currently disabled in this environment. Please authenticate with email & password.`
    );
    setTimeout(() => setInfoNotice(''), 5000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F8F5] font-sans selection:bg-[#15803d]/20 selection:text-[#15803d] overflow-x-hidden">
      {/* ============================================================ */}
      {/* LEFT PANEL – 48% WIDTH PROMOTIONAL HERO (DESKTOP)            */}
      {/* ============================================================ */}
      <div className="relative hidden lg:flex lg:w-[48%] min-h-screen flex-col justify-between p-10 lg:p-12 overflow-hidden select-none bg-stone-900">
        {/* Background Image: Pixel-perfect agricultural landscape with wooden crate & leaves */}
        <div
          className="absolute inset-0 bg-cover bg-left lg:bg-center"
          style={{
            backgroundImage: "url('/login-promo-left.jpg')",
          }}
        />

        {/* Floating Back to Store Button (subtle & unobtrusive) */}
        <div className="relative z-20 flex justify-start">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/95 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full transition border border-white/20 cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          )}
        </div>

        {/* Hidden Accessible Content for Screen Readers & SEO */}
        <div className="sr-only">
          <span>Farm to Home</span>
          <h1>Fresh Fruits & Vegetables</h1>
          <p>Direct from Trusted Farmers</p>
          <ul>
            <li>24–48 Hrs Delivery</li>
            <li>Farm Fresh</li>
            <li>Quality Assured</li>
          </ul>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT PANEL – 52% WIDTH CLEAN LOGIN CARD CONTAINER           */}
      {/* ============================================================ */}
      <div className="relative w-full lg:w-[52%] min-h-screen flex items-center justify-center px-3 py-6 sm:px-6 sm:py-8 lg:p-12 overflow-hidden bg-[#F4F8F5] min-w-0">
        {/* Soft decorative leaf watermarks in bottom corners (visible on tablet/desktop) */}
        <div className="hidden sm:block absolute bottom-0 right-0 translate-x-6 translate-y-6 w-56 h-56 pointer-events-none opacity-25">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M190 190C190 110 130 50 50 50C50 130 110 190 190 190Z"
              fill="#22c55e"
            />
            <path
              d="M170 170C170 120 120 70 70 70C70 120 120 170 170 170Z"
              fill="#15803d"
            />
          </svg>
        </div>

        <div className="hidden sm:block absolute bottom-0 left-0 -translate-x-6 translate-y-6 w-48 h-48 pointer-events-none opacity-20">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 190C10 110 70 50 150 50C150 130 90 190 10 190Z"
              fill="#22c55e"
            />
          </svg>
        </div>

        {/* Main Floating Card matching reference proportions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10 bg-white rounded-3xl sm:rounded-[2.25rem] px-4 py-6 sm:p-8 md:p-12 shadow-2xl shadow-emerald-950/5 border border-stone-100 max-w-[530px] w-full min-w-0 mx-auto"
        >
          {/* Brand Logo Header */}
          <div className="text-center">
            {/* FreshFruit Market Logo: Two crisp green leaves + text */}
            <div
              className="inline-flex items-center justify-center gap-2 group cursor-pointer"
              onClick={onNavigateHome}
            >
              {/* Organic Two-Leaves SVG matching exact logo shape */}
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-[#15803d] shrink-0"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.5 5.5C18.5 5.5 13.5 10.5 13.5 17C13.5 20.2 14.8 23 17 25L13.5 28.5H18.5L21.5 25.5C23.2 26 24.8 26.2 26.5 26.2C33.5 26.2 38.5 21.2 38.5 14.7C38.5 8.2 33.5 5.5 25.5 5.5Z"
                  fill="#15803d"
                  transform="scale(0.7) translate(-3, 0)"
                />
                <path
                  d="M8.5 23.5C8.5 16.5 13.5 11.5 20 11.5C23.2 11.5 26 12.8 28 15L31.5 11.5V16.5L28.5 19.5C29 21.2 29.2 22.8 29.2 24.5C29.2 31.5 24.2 36.5 17.7 36.5C11.2 36.5 8.5 31.5 8.5 23.5Z"
                  fill="#22c55e"
                  transform="scale(0.55) translate(-2, 10)"
                />
              </svg>

              <div className="text-left">
                <span className="text-xl sm:text-2xl font-black text-[#15803d] tracking-tight block leading-tight">
                  FreshFruit Market
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-600 tracking-wide block">
                  Farm Fresh • Direct from Farmers
                </span>
              </div>
            </div>

            {/* Welcome Headings */}
            <h2 className="text-2xl sm:text-[1.75rem] font-black text-stone-900 mt-5 mb-1 tracking-tight">
              Welcome Back 👋
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-500 font-medium">
              Login to your FreshFruit Market account
            </p>
          </div>

          {/* 5-Role Selector (Guaranteed 5-column responsive grid) */}
          <div className="mt-5 mb-5">
            <div
              className="grid gap-1 sm:gap-2"
              style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
            >
              {Object.entries(DEMO_ACCOUNTS).map(([key, item]) => {
                const IconComponent = item.icon;
                const isSelected = selectedRole === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectRole(key)}
                    className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-0.5 sm:px-1.5 rounded-xl transition-all duration-200 cursor-pointer min-w-0 ${
                      isSelected
                        ? 'bg-[#ecfdf5] border-[1.5px] border-[#16a34a] text-[#15803d] shadow-2xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/80'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 mb-1 shrink-0 ${
                        isSelected ? 'text-[#16a34a] stroke-[2.2]' : 'text-stone-500'
                      }`}
                    />
                    <span
                      className={`text-[9.5px] sm:text-xs font-bold leading-none truncate max-w-full ${
                        isSelected ? 'text-[#15803d]' : 'text-stone-700'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert Messages */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </motion.div>
            )}

            {infoNotice && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="flex-1">{infoNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-600" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-stone-200 focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 outline-none transition bg-white text-stone-900 placeholder:text-stone-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-stone-600" />
                <span>Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs sm:text-sm pl-10 pr-11 py-2.5 sm:py-3 rounded-xl border border-stone-200 focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 outline-none transition bg-white text-stone-900 placeholder:text-stone-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-[#15803d] focus:ring-[#15803d] accent-[#15803d] cursor-pointer"
                />
                <span className="font-medium text-stone-700">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  alert('Password recovery is linked to your registered email. In development, demo password is "DemoPass123!".')
                }
                className="font-bold text-[#15803d] hover:text-[#075B43] transition cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-[#15803d]/25 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold">Login</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Divider: "or continue with" */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] sm:text-xs font-semibold text-stone-400 whitespace-nowrap">
              or continue with
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleOAuthClick('Google')}
              className="w-full py-2.5 px-1.5 sm:px-3 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 transition flex items-center justify-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-bold text-stone-700 shadow-2xs cursor-pointer min-w-0"
            >
              {/* Google colored G svg */}
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="truncate">
                <span className="hidden sm:inline">Continue with </span>Google
              </span>
            </button>

            {/* GitHub Button */}
            <button
              type="button"
              onClick={() => handleOAuthClick('GitHub')}
              className="w-full py-2.5 px-1.5 sm:px-3 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 transition flex items-center justify-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-bold text-stone-700 shadow-2xs cursor-pointer min-w-0"
            >
              {/* GitHub Mark svg */}
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-stone-900 shrink-0" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span className="truncate">
                <span className="hidden sm:inline">Continue with </span>GitHub
              </span>
            </button>
          </div>

          {/* Registration Navigation Link */}
          <div className="mt-7 text-center text-xs text-stone-600">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-black text-[#15803d] hover:underline cursor-pointer"
            >
              Register Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
