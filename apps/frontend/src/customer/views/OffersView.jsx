import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function OffersView({ onNavigateTab }) {
  const [offersData, setOffersData] = useState({ coupons: [], promotionalBanners: [] });
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await customerApi.getOffers();
        setOffersData(data || { coupons: [], promotionalBanners: [] });
      } catch (err) {
        console.error('Failed to load offers:', err);
      }
    }
    loadOffers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const coupons = offersData.coupons || [
    { code: 'FRESH30', type: 'percentage', value: 30, maxDiscount: 150, minOrderAmount: 299, description: '30% OFF on all fresh fruits & vegetables' },
    { code: 'WELCOME50', type: 'fixed', value: 50, minOrderAmount: 199, description: 'Flat ₹50 OFF on your first farm harvest' },
    { code: 'FREESHIP', type: 'fixed', value: 40, minOrderAmount: 399, description: 'Free doorstep cold-chain delivery on ₹399+' },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-700" />
          <h2 className="text-xl font-black text-stone-900">Exclusive Offers & Coupons</h2>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Save on seasonal harvests with verified farm-fresh vouchers
        </p>
      </div>

      {/* Hero Banner (matching the screenshot) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d4f2e] via-[#105e37] to-[#15803d] text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md z-10">
          <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest">
            Today's Special Offer
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Up to 30% OFF on Fresh Fruits & Vegetables
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100">
            Use code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">FRESH30</span> at checkout.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleCopy('FRESH30')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0d4f2e] text-xs font-bold shadow-md hover:bg-emerald-50 transition cursor-pointer"
            >
              {copiedCode === 'FRESH30' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-700" />
                  <span>Copy Coupon Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 shrink-0">
          <div className="w-20 h-20 rounded-full bg-rose-600 border-2 border-white/80 shadow-lg flex flex-col items-center justify-center text-center rotate-[-8deg] animate-pulse">
            <span className="text-sm font-black text-white">30%</span>
            <span className="text-[9px] font-extrabold uppercase text-white">OFF</span>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80"
            alt="Offer Produce"
            className="w-36 h-28 object-cover rounded-2xl shadow-lg border-2 border-white/30"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div
              key={coupon.code}
              className="bg-white rounded-3xl border border-dashed border-emerald-300 p-5 space-y-3 relative overflow-hidden shadow-xs hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0a3d24] font-mono tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {coupon.code}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700">
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                </span>
              </div>

              <p className="text-xs text-stone-600 font-medium">
                {coupon.description || `Get discount on orders above ₹${coupon.minOrderAmount}`}
              </p>

              <div className="text-[10px] text-stone-400">
                Min. Order Amount: ₹{coupon.minOrderAmount || 0}
              </div>

              <button
                onClick={() => handleCopy(coupon.code)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#f4f8f5] hover:bg-[#e8fbf0] text-emerald-900 border border-emerald-200'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Coupon</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
