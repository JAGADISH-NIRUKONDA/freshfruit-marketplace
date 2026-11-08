import React from 'react';

export default function FreshFruitLogo({ variant = 'light', size = 'default' }) {
  const isLight = variant === 'light'; // Light text for dark backgrounds (like the sidebar)

  return (
    <div className="inline-flex items-center gap-2.5 select-none text-left">
      {/* Shopping Cart with Fresh Fruits Vector Icon matching screenshot */}
      <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Cart Basket Outline */}
          <path
            d="M8 12H13L18 32H38L42 16H16"
            stroke={isLight ? '#4ade80' : '#15803d'}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Fruit 1: Red Apple */}
          <circle cx="23" cy="18" r="5" fill="#ef4444" />
          <path d="M23 13C23 10.5 25 10 26 9.5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />

          {/* Fruit 2: Orange / Citrus */}
          <circle cx="32" cy="19" r="5.5" fill="#f97316" />
          <path d="M33 13.5C34 11 36.5 11 37.5 11" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />

          {/* Green Leaf rising from basket */}
          <path
            d="M27 15C27 9 32 7 35 7C35 12 30 15 27 15Z"
            fill="#22c55e"
          />

          {/* Cart Wheels */}
          <circle cx="21" cy="38" r="3" fill={isLight ? '#facc15' : '#15803d'} />
          <circle cx="35" cy="38" r="3" fill={isLight ? '#facc15' : '#15803d'} />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center tracking-tight">
          <span
            className={`text-lg sm:text-xl font-black ${
              isLight ? 'text-white' : 'text-[#0a3d24]'
            }`}
          >
            FreshFruit
          </span>
          <span className="text-lg sm:text-xl font-black text-[#ea580c] ml-1">
            Market
          </span>
        </div>
        <span
          className={`text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase ${
            isLight ? 'text-emerald-200/80' : 'text-stone-500'
          }`}
        >
          Farm Fresh • Direct
        </span>
      </div>
    </div>
  );
}
