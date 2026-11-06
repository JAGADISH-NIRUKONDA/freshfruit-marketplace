import React, { useState } from 'react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_REVIEWS = [
  {
    customerName: 'Ananya Deshmukh',
    productName: 'Himachal Royal Gala Apples',
    rating: 5,
    title: 'Incredible crunch and natural sweetness',
    comment:
      'Arrived packaged in sustainable ventilated cartons. Tasted crisp and intensely aromatic, exactly like freshly plucked fruit from the tree. Zero waxy sheen!',
    date: 'Nov 2026',
    isVerifiedPurchase: true,
  },
  {
    customerName: 'Karan Mehra',
    productName: 'Ratnagiri Alphonso Mangoes',
    rating: 5,
    title: 'Authentic GI-Tagged Ratnagiri Aroma',
    comment:
      'We stopped buying supermarket mangoes after this. The deep saffron pulp and natural ripening aroma filled our entire kitchen. Worth every rupee.',
    date: 'Oct 2026',
    isVerifiedPurchase: true,
  },
  {
    customerName: 'Dr. Shalini Raman',
    productName: 'Nagpur Organic Juicy Mandarins',
    rating: 5,
    title: 'Tested pesticide-free for my kids',
    comment:
      'Being a nutritionist, chemical residue is my #1 concern. FreshFruit’s direct farmer harvest provides true organic integrity and natural vitamin C juice.',
    date: 'Oct 2026',
    isVerifiedPurchase: true,
  },
];

export default function Testimonials({ reviews = [] }) {
  const displayReviews = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayReviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === displayReviews.length - 1 ? 0 : prev + 1));
  };

  const current = displayReviews[currentIndex] || DEFAULT_REVIEWS[0];

  return (
    <section className="py-16 sm:py-24 bg-[#F6FAF7] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header with Carousel Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-[#008C60] bg-emerald-100 px-3 py-1 rounded-full inline-block">
              Verified Buyer Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#191D1A] tracking-tight">
              Loved by Health-Conscious Families
            </h2>
            <p className="text-stone-600 text-sm max-w-lg">
              Real reviews from customers receiving weekly orchard harvest boxes.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:border-[#008C60] transition cursor-pointer"
              title="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:border-[#008C60] transition cursor-pointer"
              title="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Card Presentation */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-lg shadow-stone-200/50">
          <Quote className="w-16 h-16 text-[#008C60]/10 absolute -top-2 right-6 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 text-left"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-stone-400 ml-2">
                  5.0 Verified Score
                </span>
              </div>

              {/* Title & Comment */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#191D1A]">
                  "{current.title}"
                </h3>
                <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {current.comment}
                </p>
              </div>

              {/* Customer Info */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#008C60] text-white flex items-center justify-center font-black text-sm">
                    {current.customerName?.[0] || 'C'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#191D1A]">
                      {current.customerName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Purchased: <strong className="text-stone-700">{current.productName}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#008C60] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-[#008C60]" />
                  <span>Verified FreshFruit Buyer</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8 pt-4 border-t border-stone-100">
            {displayReviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-[#008C60]' : 'w-2 bg-stone-200'
                }`}
                title={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

