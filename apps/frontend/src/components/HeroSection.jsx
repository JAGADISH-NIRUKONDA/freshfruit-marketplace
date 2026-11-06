import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Star,
  Sparkles,
  MapPin,
  CheckCircle2,
  Leaf,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ onShopHarvest, onBecomeGrower }) {
  const headlineWords = ['Sun-Ripened', 'Fruits,', 'Straight', 'From', 'Orchards.'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: 'Residue-Free',
      subtitle: 'Zero synthetic waxes or pesticides',
    },
    {
      icon: Clock,
      title: '< 24-Hour Harvest',
      subtitle: 'Dispatched directly from orchard',
    },
    {
      icon: HeartHandshake,
      title: 'Fair Farmer Value',
      subtitle: '80%+ directly to smallholder growers',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F6FAF7] pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Animated Organic Gradient Blobs & Floating Leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 45, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#008C60]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-[#A3E635]/15 rounded-full blur-3xl"
        />
        {/* Floating botanical leaves */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 15, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-[#008C60]/20 hidden lg:block"
        >
          <Leaf className="w-12 h-12" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-24 right-16 text-[#008C60]/15 hidden lg:block"
        >
          <Leaf className="w-16 h-16" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Organic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#008C60]/10 border border-[#008C60]/20 text-[#075B43] text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#008C60]" />
              <span>Certified Direct Farm-To-Table Marketplace</span>
            </motion.div>

            {/* Word-by-word Headline Reveal */}
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#191D1A] tracking-tight leading-[1.08]"
            >
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className={`inline-block mr-3 ${
                    word.includes('Orchards.')
                      ? 'text-[#008C60] underline decoration-[#A3E635] decoration-wavy decoration-2'
                      : ''
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Discover fresh produce directly from trusted farmers and bring nature's goodness to your doorstep.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onShopHarvest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#008C60] hover:bg-[#075B43] text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg shadow-[#008C60]/25 transition cursor-pointer"
              >
                <span>Shop Seasonal Harvest</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBecomeGrower}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-[#075B43] border border-stone-300 font-bold text-sm px-7 py-4 rounded-full shadow-xs hover:border-[#008C60] transition cursor-pointer"
              >
                <Leaf className="w-4 h-4 text-[#008C60]" />
                <span>Become a Partner Grower</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicator Cards with Staggered Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-stone-200/80"
            >
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + idx * 0.12 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-stone-200/70 shadow-2xs text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#008C60]/10 flex items-center justify-center text-[#008C60] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#191D1A] leading-tight">
                        {badge.title}
                      </h4>
                      <p className="text-[10px] text-stone-500 leading-tight mt-0.5">
                        {badge.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Hero Visual, Fruit Photography & Featured Orchard Overlay */}
          <div className="lg:col-span-5 relative">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Orchard Image Frame - Scale-in 0.85 to 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-square"
              >
                <img
                  src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh organic harvest"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#A3E635] mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Peak Season Morning Pluck</span>
                  </div>
                  <h3 className="text-xl font-black">Himachal Royal Gala & Alphonso</h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    Tested 0.00 ppm pesticide residue by Agri-Test Labs
                  </p>
                </div>
              </motion.div>

              {/* Floating Featured Orchard Pill Card with Pulse */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.8 },
                  x: { duration: 0.6, delay: 0.8 },
                  scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
                }}
                className="absolute -top-6 -left-6 sm:-left-8 bg-white p-4 rounded-2xl shadow-xl border border-stone-200 flex items-center gap-3.5 z-20 max-w-[260px]"
              >
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=120&q=80"
                  alt="Rajesh Sharma"
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] uppercase font-black text-[#008C60] bg-emerald-50 px-1.5 py-0.5 rounded">
                      Featured Orchard
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight mt-1">
                    Sharma Alpine Groves
                  </h4>
                  <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-stone-400" />
                    <span>Shimla, 7,200 ft</span>
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-stone-800">4.9</span>
                    <span className="text-stone-400 font-normal text-[10px]">(84 reviews)</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating 100% Organic Seal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#075B43] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/30 flex items-center gap-2.5 z-20"
              >
                <div className="w-9 h-9 rounded-xl bg-[#008C60] flex items-center justify-center text-[#A3E635]">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-emerald-300">Guaranteed</p>
                  <p className="text-xs font-black text-white leading-tight">100% Wax-Free</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

