import React from 'react';
import { motion } from 'framer-motion';

/**
 * Authentic FreshFruit Market Logo matching reference image:
 * - Shopping cart wireframe in forest green
 * - Red apple & golden fruit inside cart with sprout leaves
 * - Dual leaves flanking "Fresh"
 * - "Fresh" in forest green (#0e4a29), "Fruit" in orange (#f97316)
 * - "— M a r k e t —" spaced subtitle
 */
export default function FreshFruitLogo({
  variant = 'header', // 'header' | 'hero' | 'light'
  onClick,
}) {
  if (variant === 'light') {
    return (
      <div
        onClick={onClick}
        className="inline-flex items-center gap-2.5 select-none text-left cursor-pointer"
      >
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <path
              d="M8 12H13L18 32H38L42 16H16"
              stroke="#4ade80"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="23" cy="18" r="5" fill="#ef4444" />
            <path d="M23 13C23 10.5 25 10 26 9.5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="32" cy="19" r="5.5" fill="#f97316" />
            <path d="M33 13.5C34 11 36.5 11 37.5 11" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M27 15C27 9 32 7 35 7C35 12 30 15 27 15Z" fill="#22c55e" />
            <circle cx="21" cy="38" r="3" fill="#facc15" />
            <circle cx="35" cy="38" r="3" fill="#facc15" />
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center tracking-tight">
            <span className="text-lg sm:text-xl font-black text-white">Fresh</span>
            <span className="text-lg sm:text-xl font-black text-[#ea580c] ml-0.5">Fruit</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-emerald-200/80">
            Market
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group"
      >
        {/* Shopping Cart with Fruits Icon */}
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
          <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
            {/* Cart Wheels */}
            <circle cx="36" cy="72" r="5.5" fill="#0e4a29" />
            <circle cx="70" cy="72" r="5.5" fill="#0e4a29" />
            
            {/* Cart Body */}
            <path
              d="M16 16 H26 L38 58 H76 L86 28 H30"
              stroke="#0e4a29"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cart Basket Grid Lines */}
            <line x1="38" y1="38" x2="80" y2="38" stroke="#0e4a29" strokeWidth="2.5" />
            <line x1="42" y1="48" x2="74" y2="48" stroke="#0e4a29" strokeWidth="2.5" />
            
            {/* Red Apple in Cart */}
            <circle cx="48" cy="24" r="11" fill="#dc2626" />
            <path d="M48 13 C48 9 52 8 52 8" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 10 Q56 8 54 14 Z" fill="#22c55e" />

            {/* Golden Fruit in Cart */}
            <circle cx="67" cy="24" r="11" fill="#f59e0b" />
            <path d="M67 13 Q72 10 70 15 Z" fill="#22c55e" />

            {/* Sprout Leaf in Center */}
            <path d="M57 16 C57 6 63 3 65 14 C63 16 59 17 57 16 Z" fill="#15803d" />
          </svg>
        </div>

        {/* Brand Text */}
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline font-black tracking-tight text-lg sm:text-xl">
            <span className="text-[#0e4a29]">Fresh</span>
            <span className="text-[#f97316]">Fruit</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold text-[#0e4a29] tracking-[0.25em] uppercase mt-0.5">
            Market
          </span>
        </div>
      </div>
    );
  }

  // Hero Display Variant (Large, centered, high-impact matching reference screenshot)
  return (
    <div className="flex flex-col items-center select-none">
      {/* Large Central Shopping Cart Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-28 h-24 sm:w-36 sm:h-28 md:w-44 md:h-34 mb-2 drop-shadow-md"
      >
        <svg viewBox="0 0 120 95" className="w-full h-full" fill="none">
          {/* Cart Wheels with rims */}
          <circle cx="44" cy="85" r="7" fill="#0e4a29" />
          <circle cx="44" cy="85" r="3" fill="#ffffff" />
          <circle cx="86" cy="85" r="7" fill="#0e4a29" />
          <circle cx="86" cy="85" r="3" fill="#ffffff" />
          
          {/* Sturdy Cart Wireframe */}
          <path
            d="M18 20 H32 L46 70 H92 L104 35 H36"
            stroke="#0e4a29"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner basket slats */}
          <line x1="45" y1="47" x2="98" y2="47" stroke="#0e4a29" strokeWidth="3" />
          <line x1="50" y1="58" x2="90" y2="58" stroke="#0e4a29" strokeWidth="3" />
          <line x1="62" y1="36" x2="62" y2="68" stroke="#0e4a29" strokeWidth="2.5" />
          <line x1="78" y1="36" x2="78" y2="68" stroke="#0e4a29" strokeWidth="2.5" />
          
          {/* Red Apple with shine */}
          <circle cx="58" cy="30" r="14" fill="#dc2626" />
          <ellipse cx="54" cy="25" rx="3.5" ry="5.5" fill="#f87171" opacity="0.6" />
          <path d="M58 16 C58 10 63 9 63 9" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 12 Q68 10 66 17 Z" fill="#22c55e" />

          {/* Golden Orange with citrus glow */}
          <circle cx="82" cy="30" r="14" fill="#f59e0b" />
          <ellipse cx="78" cy="25" rx="3.5" ry="5.5" fill="#fde68a" opacity="0.6" />
          <path d="M82 16 Q88 12 86 18 Z" fill="#22c55e" />

          {/* Lush Green Sprout Leaves in Center */}
          <path
            d="M68 20 C68 6 76 2 79 16 C76 19 71 21 68 20 Z"
            fill="#16a34a"
          />
          <path
            d="M72 18 C74 8 83 5 84 18 C80 20 75 20 72 18 Z"
            fill="#15803d"
          />
        </svg>
      </motion.div>

      {/* FreshFruit Title with Sprouting Leaves */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="relative inline-flex items-center justify-center"
      >
        {/* Two Sprouting Leaves on the left of "Fresh" */}
        <div className="absolute -left-7 sm:-left-10 md:-left-14 -top-3 sm:-top-5 md:-top-7 w-8 sm:w-11 md:w-14 h-8 sm:h-11 md:h-14 pointer-events-none">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <path
              d="M32 45 C32 20 12 10 2 12 C10 28 22 42 32 45 Z"
              fill="#15803d"
            />
            <path
              d="M32 45 C36 26 48 16 56 18 C50 32 40 42 32 45 Z"
              fill="#22c55e"
            />
          </svg>
        </div>

        {/* Brand Text */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-none text-center">
          <span className="text-[#0e4a29]">Fresh</span>
          <span className="text-[#f97316]">Fruit</span>
        </h1>
      </motion.div>

      {/* Subtitle: — M a r k e t — */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center justify-center gap-3 sm:gap-5 mt-2 sm:mt-3 w-full max-w-sm sm:max-w-md"
      >
        <span className="h-[2px] sm:h-[3px] flex-1 bg-[#0e4a29] rounded-full" />
        <span className="text-base sm:text-xl md:text-2xl font-bold tracking-[0.3em] uppercase text-[#0e4a29]">
          Market
        </span>
        <span className="h-[2px] sm:h-[3px] flex-1 bg-[#0e4a29] rounded-full" />
      </motion.div>

      {/* Tagline: Fresh From Farm to Your Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-3 sm:mt-4 text-center relative"
      >
        <p className="text-sm sm:text-lg md:text-xl font-medium italic text-[#0e4a29] tracking-wide font-serif">
          Fresh From Farm to Your Table
        </p>

        {/* Curved lime flourish underline ending with leaf */}
        <div className="w-48 sm:w-64 md:w-72 mx-auto mt-1">
          <svg viewBox="0 0 240 18" fill="none" className="w-full h-auto">
            <path
              d="M10 8 Q120 18 215 8"
              stroke="#84cc16"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Leaf at end of flourish */}
            <path
              d="M215 8 C222 4 230 6 235 9 C228 13 220 12 215 8 Z"
              fill="#84cc16"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
