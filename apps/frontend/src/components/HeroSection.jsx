import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import FreshFruitLogo from './FreshFruitLogo';

export default function HeroSection({ onShopHarvest }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Mouse Parallax for Desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for dampened organic movement
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Layered parallax transforms
  const fruitParallaxX = useTransform(smoothMouseX, [-400, 400], [-14, 14]);
  const fruitParallaxY = useTransform(smoothMouseY, [-400, 400], [-10, 10]);

  const leafParallaxX = useTransform(smoothMouseX, [-400, 400], [18, -18]);
  const leafParallaxY = useTransform(smoothMouseY, [-400, 400], [14, -14]);

  const handleMouseMove = (e) => {
    // Only apply on desktop viewports
    if (window.innerWidth >= 1024) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      mouseX.set(e.clientX - rect.left - centerX);
      mouseY.set(e.clientY - rect.top - centerY);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleExploreClick = () => {
    if (onShopHarvest) {
      onShopHarvest();
    } else {
      const produceEl = document.getElementById('produce');
      if (produceEl) produceEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100vh-5rem)] max-h-[960px] flex flex-col justify-between overflow-hidden bg-[#FAFBF9] select-none"
    >
      {/* ============================================================ */}
      {/* 1. BACKGROUND CANVAS: Clean photographic master scene         */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: "url('/homepage-clean-canvas.jpg')",
        }}
      />

      {/* Pulsing Luminous Golden Ring Glow behind Center Hero */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] md:w-[560px] h-[340px] sm:h-[480px] md:h-[560px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(254,240,138,0.25) 0%, rgba(134,239,172,0.15) 50%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* ============================================================ */}
      {/* 2. 3D FLOATING ANIMATION PRODUCE & LEAVES                    */}
      {/* ============================================================ */}

      {/* Floating Red Apple (Left side, gentle floating + 3D rotation) */}
      <motion.div
        style={{ x: fruitParallaxX, y: fruitParallaxY }}
        animate={{
          y: [0, -10, 0],
          rotate: [-2, 3, -2],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden lg:block absolute left-[8%] xl:left-[11%] top-[45%] w-18 sm:w-22 md:w-26 h-18 sm:h-22 md:h-26 pointer-events-none z-20 drop-shadow-xl"
      >
        <img
          src="/floating-apple.png"
          alt="Fresh Apple"
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </motion.div>

      {/* Floating Orange Slice (Left foreground, gentle bobbing) */}
      <motion.div
        style={{ x: fruitParallaxX, y: fruitParallaxY }}
        animate={{
          y: [0, 8, 0],
          rotate: [0, -4, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.8,
        }}
        className="hidden lg:block absolute left-[15%] xl:left-[18%] top-[60%] w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 pointer-events-none z-20 drop-shadow-xl"
      >
        <img
          src="/floating-orange.png"
          alt="Juicy Orange"
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </motion.div>

      {/* Floating Strawberry (Left side) */}
      <motion.div
        style={{ x: fruitParallaxX, y: fruitParallaxY }}
        animate={{
          y: [0, -7, 0],
          rotate: [2, -3, 2],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.2,
        }}
        className="hidden lg:block absolute left-[10%] xl:left-[12%] top-[72%] w-11 sm:w-13 md:w-15 h-11 sm:h-13 md:h-15 pointer-events-none z-20 drop-shadow-lg"
      >
        <img
          src="/floating-strawberry.png"
          alt="Fresh Strawberry"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Floating Botanical Leaves with 3D Rotation */}
      {/* Top Left Leaf */}
      <motion.div
        style={{ x: leafParallaxX, y: leafParallaxY }}
        animate={{
          y: [0, -14, 0],
          rotate: [-15, 8, -15],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-[20%] sm:left-[24%] top-[10%] sm:top-[12%] w-10 sm:w-14 md:w-16 h-10 sm:h-14 md:h-16 pointer-events-none z-20 opacity-90 drop-shadow-md"
      >
        <img
          src="/floating-leaf-1.png"
          alt="Organic Leaf"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Top Right Leaf */}
      <motion.div
        style={{ x: leafParallaxX, y: leafParallaxY }}
        animate={{
          y: [0, 12, 0],
          rotate: [10, -12, 10],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 7.0,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute right-[24%] sm:right-[28%] top-[14%] sm:top-[16%] w-8 sm:w-11 md:w-13 h-8 sm:h-11 md:h-13 pointer-events-none z-20 opacity-90 drop-shadow-md"
      >
        <img
          src="/floating-leaf-2.png"
          alt="Organic Leaf"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Middle Right Leaf */}
      <motion.div
        style={{ x: leafParallaxX, y: leafParallaxY }}
        animate={{
          y: [0, -10, 0],
          rotate: [-8, 14, -8],
        }}
        transition={{
          duration: 5.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute right-[22%] sm:right-[26%] top-[64%] w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 pointer-events-none z-20 opacity-85 drop-shadow-sm"
      >
        <img
          src="/floating-leaf-3.png"
          alt="Organic Leaf"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Far Right Accent Leaves */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2.0,
        }}
        className="absolute right-[5%] sm:right-[8%] top-[24%] w-10 sm:w-14 h-10 sm:h-14 pointer-events-none z-20 opacity-80"
      >
        <img
          src="/floating-leaf-1.png"
          alt="Organic Leaf"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* ============================================================ */}
      {/* 3. CENTRAL HERO BRAND SHOWCASE                                */}
      {/* ============================================================ */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center px-4 pt-4 sm:pt-6 pb-2 sm:pb-4 max-w-4xl mx-auto w-full">
        {/* Animated Brand Logo, Title & Tagline */}
        <FreshFruitLogo variant="hero" />

        {/* Action Buttons: Explore Now & Watch Intro */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 z-30"
        >
          {/* Explore Now Button (Forest Green Pill) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExploreClick}
            className="flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#0e4a29] hover:bg-[#07361d] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#0e4a29]/30 hover:shadow-2xl transition-all cursor-pointer"
          >
            <span>Explore Now</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </motion.button>

          {/* Watch Intro Button (Circular Play Button + Label) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsVideoModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2 text-stone-800 hover:text-[#0e4a29] font-bold text-sm sm:text-base transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#0e4a29] flex items-center justify-center bg-white/80 group-hover:bg-[#0e4a29] group-hover:text-white transition-all shadow-md text-[#0e4a29]">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span className="text-[#0e4a29] tracking-tight">Watch Intro</span>
          </motion.button>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM PADDING FOR CAROUSEL DOTS & CURVED WAVES           */}
      {/* ============================================================ */}
      <div className="relative z-30 flex items-center justify-center gap-2.5 pb-4 sm:pb-6 pointer-events-none h-6" />

      {/* ============================================================ */}
      {/* 5. WATCH INTRO VIDEO MODAL                                   */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border border-stone-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAFBF9]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0e4a29]" />
                  <h3 className="font-bold text-sm sm:text-base text-[#0e4a29]">
                    FreshFruit Market — Direct From Farm To Table
                  </h3>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0"
                  title="FreshFruit Market Story"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer Note */}
              <div className="p-4 sm:p-5 bg-white text-center">
                <p className="text-xs sm:text-sm text-stone-600">
                  Connecting conscious consumers with verified organic fruit growers and family orchards across the country.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
