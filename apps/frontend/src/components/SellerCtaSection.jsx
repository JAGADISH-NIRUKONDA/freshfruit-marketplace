import React from 'react';
import { Leaf, ArrowRight, ShieldCheck, CheckCircle2, DollarSign, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellerCtaSection({ onRegisterGrower }) {
  return (
    <section id="seller-cta" className="py-16 sm:py-20 bg-white border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#075B43] via-[#008C60] to-[#075B43] text-white p-8 sm:p-12 lg:p-16 shadow-xl">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#A3E635] bg-emerald-950/40 px-3.5 py-1 rounded-full border border-emerald-400/20">
                <Leaf className="w-3.5 h-3.5" />
                <span>Smallholder Grower Partnership Program</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Are You An Organic Grower? Sell Directly on FreshFruit.
              </h2>

              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl">
                Tired of losing 50% to wholesale commissions and delayed payments? Join over 120+ accredited orchardists and receive fair market pricing, direct logistics pickup at your farm gate, and weekly settlements.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/40 flex items-center justify-center text-[#A3E635] shrink-0 border border-emerald-400/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">80%+ Direct Payout</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/40 flex items-center justify-center text-[#A3E635] shrink-0 border border-emerald-400/20">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Farm Gate Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/40 flex items-center justify-center text-[#A3E635] shrink-0 border border-emerald-400/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Free Residue Audits</span>
                </div>
              </div>
            </div>

            {/* Right Action Button Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center space-y-4">
              <h3 className="text-lg font-black text-white leading-tight">
                Start Selling Your Harvest
              </h3>
              <p className="text-xs text-emerald-100">
                Simple onboarding. Verification within 24 hours.
              </p>
              <button
                onClick={onRegisterGrower}
                className="w-full bg-[#A3E635] hover:bg-lime-400 text-stone-950 font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Register as Grower / Seller</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-emerald-200">
                Zero listing fees for chemical-free growers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

