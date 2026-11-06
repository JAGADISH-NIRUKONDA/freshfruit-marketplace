import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { marketplaceApi } from '../services/marketplaceApi';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await marketplaceApi.subscribeNewsletter(email);
      setStatus('success');
      setMessage(res.message || 'Subscribed successfully! Welcome to FreshFruit.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-[#075B43] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl text-center space-y-6"
        >
          {/* Subtle Organic Background Details */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#008C60]/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#A3E635]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#A3E635] bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Weekly Farm Dispatch Alert</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Get Notified When Fresh Harvests Arrive
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Subscribe to receive weekly crop schedules, seasonal variety drops (like Ratnagiri Alphonso & Himalayan Gala), and subscriber-only discounts.
            </p>
          </div>

          {/* Form */}
          <div className="relative z-10 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address..."
                  className="w-full bg-white text-stone-900 text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-full border border-transparent focus:border-[#A3E635] outline-hidden placeholder:text-stone-400 shadow-md"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#A3E635] hover:bg-lime-400 text-stone-950 font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition shadow-md disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>

            {/* Status Feedback Message */}
            {status === 'success' && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-900/60 border border-emerald-400/30 text-[#A3E635] text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 p-3 rounded-xl bg-rose-900/60 border border-rose-400/30 text-rose-200 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{message}</span>
              </div>
            )}

            <p className="text-[11px] text-emerald-200/80 mt-3">
              We respect your privacy. Zero spam, unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

