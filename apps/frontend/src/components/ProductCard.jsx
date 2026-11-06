import React, { useState } from 'react';
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  MapPin,
  Check,
  ShieldCheck,
  Sparkles,
  Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({
  product,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenDetails,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleIncrement = (e) => {
    e.stopPropagation();
    const maxQty = product.inStock || 50;
    if (quantity < maxQty) setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (product.inStock <= 0) return;
    onAddToCart({ ...product, quantity });
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const isLowStock = product.inStock > 0 && product.inStock <= 10;
  const isOutOfStock = product.inStock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between overflow-hidden group select-none relative"
    >
      {/* Top Image & Floating Badges */}
      <div
        onClick={() => onOpenDetails?.(product)}
        className="relative aspect-4/3 overflow-hidden bg-[#F6FAF7] cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 bg-[#008C60] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#A3E635]" />
              Organic
            </span>
          )}
          {product.grade && (
            <span className="bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs border border-stone-200/60">
              Grade {product.grade}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id || product._id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-md cursor-pointer z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 hover:bg-white text-stone-400 hover:text-rose-500 border border-stone-200/60'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails?.(product);
          }}
          className="absolute inset-x-6 bottom-10 py-2 bg-white/95 backdrop-blur-md text-[#191D1A] hover:bg-[#008C60] hover:text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 cursor-pointer z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>

        {/* Stock Status Badge */}
        <div className="absolute bottom-2.5 left-3 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              Harvest Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              Only {product.inStock} Left
            </span>
          ) : (
            <span className="bg-emerald-950/80 backdrop-blur-xs text-[#A3E635] font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Body Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Farm Name & Location */}
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="truncate max-w-[180px] font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#008C60] shrink-0" />
              {product.farm}
            </span>
            <div className="flex items-center gap-1 font-bold text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-stone-800 text-xs">{product.rating}</span>
              <span className="text-stone-400 font-normal text-[10px]">({product.reviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetails?.(product)}
            className="font-extrabold text-sm sm:text-base text-[#191D1A] group-hover:text-[#008C60] transition leading-tight line-clamp-1 cursor-pointer hover:underline"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing, Quantity Selector & Add to Basket */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#191D1A]">
                ₹{product.discountPrice || product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{Math.round(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              {product.unit}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center bg-[#F6FAF7] border border-stone-200 rounded-xl p-1 shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-40 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-stone-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isOutOfStock || quantity >= (product.inStock || 50)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-40 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Basket Action */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                isAddedRecently
                  ? 'bg-emerald-800 text-white'
                  : isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#008C60] hover:bg-[#075B43] text-white shadow-[#008C60]/15 hover:shadow-md'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Added!</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Basket</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

