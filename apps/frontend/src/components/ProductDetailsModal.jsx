import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  MapPin,
  Check,
  ShieldCheck,
  Sparkles,
  Tractor,
  Calendar,
  AlertCircle,
  Truck,
  Leaf,
  Layers,
  Store,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { marketplaceApi } from '../services/marketplaceApi';

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenFarmerStorefront,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [detailedProduct, setDetailedProduct] = useState(product);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (product) {
      setDetailedProduct(product);
      setActiveImageIndex(0);
      setQuantity(1);

      // If product has an ID, fetch populated full details if available
      const productId = product.id || product._id;
      if (productId && typeof productId === 'string' && productId.match(/^[0-9a-fA-F]{24}$/)) {
        setLoadingDetails(true);
        marketplaceApi
          .getProductById(productId)
          .then((fullData) => {
            if (fullData) {
              setDetailedProduct((prev) => ({
                ...prev,
                ...fullData,
                farm: fullData.farm || prev.farm,
                images: fullData.images || prev.images || [prev.image],
              }));
            }
          })
          .catch(() => {
            // Keep existing product if detailed fetch fails
          })
          .finally(() => {
            setLoadingDetails(false);
          });
      }
    }
  }, [product]);

  if (!isOpen || !detailedProduct) return null;

  const currentProd = detailedProduct;
  const inStock = currentProd.inStock !== undefined ? currentProd.inStock : 25;
  const isOutOfStock = inStock <= 0;
  const isLowStock = inStock > 0 && inStock <= 10;
  const images = currentProd.images && currentProd.images.length > 0
    ? currentProd.images
    : [currentProd.image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80'];

  const handleIncrement = () => {
    if (quantity < inStock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart({ ...currentProd, quantity });
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl z-10 border border-stone-200 text-left custom-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-stone-100 text-stone-600 flex items-center justify-center shadow-md border border-stone-200 transition cursor-pointer"
          title="Close Details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            {/* Primary Display Photo */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F6FAF7] border border-stone-200 shadow-xs">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={currentProd.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                {currentProd.isOrganic && (
                  <span className="inline-flex items-center gap-1 bg-[#008C60] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#A3E635]" />
                    100% Organic
                  </span>
                )}
                {currentProd.grade && (
                  <span className="bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-stone-200">
                    Grade {currentProd.grade}
                  </span>
                )}
              </div>

              {/* Stock status watermark badge */}
              <div className="absolute bottom-3 left-3">
                {isOutOfStock ? (
                  <span className="bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-sm">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="bg-amber-500 text-stone-950 font-black text-xs px-3 py-1 rounded-lg shadow-sm">
                    Low Stock: Only {inStock} {currentProd.unit} left
                  </span>
                ) : (
                  <span className="bg-emerald-950/80 backdrop-blur-xs text-[#A3E635] font-bold text-xs px-3 py-1 rounded-lg shadow-sm">
                    In Stock ({inStock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#008C60] ring-2 ring-[#008C60]/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Farm Story Card */}
            <div className="bg-[#F6FAF7] rounded-2xl p-4 border border-stone-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#008C60] bg-emerald-100/70 px-2 py-0.5 rounded">
                  Origin Farm
                </span>
                <span className="text-[11px] text-stone-500 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#008C60]" />
                  {typeof currentProd.farm === 'object'
                    ? currentProd.farm.location
                    : currentProd.farmLocation || 'Shimla Hills, HP'}
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-sm">
                {typeof currentProd.farm === 'object'
                  ? currentProd.farm.farmName
                  : currentProd.farm || 'Sharma Alpine Groves'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {typeof currentProd.farm === 'object' && currentProd.farm.bio
                  ? currentProd.farm.bio
                  : 'Nourished with mountain glacial stream runoff, compost-fed black soil, and handpicked at dawn. 100% free of synthetic waxes and pesticides.'}
              </p>
              {onOpenFarmerStorefront && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFarmerStorefront(
                      currentProd.farm?.id ||
                        currentProd.farm?._id ||
                        currentProd.sellerId?._id ||
                        currentProd.sellerId ||
                        currentProd.farm
                    );
                  }}
                  className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-emerald-50 text-[#008C60] border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Visit Orchard Storefront</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Pricing, Controls, & Guarantees */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#008C60] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                  {currentProd.categoryName || currentProd.category}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-stone-900 text-sm font-black">{currentProd.rating || 4.9}</span>
                  <span className="text-stone-400 font-normal">
                    ({currentProd.reviewsCount || currentProd.reviews || 24} reviews)
                  </span>
                </div>
              </div>

              {/* Title & Harvest Promise */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#191D1A] leading-tight">
                  {currentProd.name}
                </h2>
                <p className="text-xs text-[#008C60] font-bold flex items-center gap-1.5 mt-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentProd.harvestDate || 'Harvested within 24 hours of plucking'}</span>
                </p>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-black text-[#191D1A]">
                  ₹{currentProd.discountPrice || currentProd.price}
                </span>
                {currentProd.originalPrice > currentProd.price && (
                  <span className="text-base text-stone-400 line-through">
                    ₹{Math.round(currentProd.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
                  per {currentProd.unit}
                </span>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                  Produce Overview
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {currentProd.description}
                </p>
              </div>

              {/* Value Guarantees Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6FAF7] border border-stone-200">
                  <ShieldCheck className="w-4 h-4 text-[#008C60] shrink-0" />
                  <span className="text-xs font-semibold text-stone-800">0.00 ppm Residue Tested</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6FAF7] border border-stone-200">
                  <Truck className="w-4 h-4 text-[#008C60] shrink-0" />
                  <span className="text-xs font-semibold text-stone-800">Cold-Chain Direct</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6FAF7] border border-stone-200">
                  <Leaf className="w-4 h-4 text-[#008C60] shrink-0" />
                  <span className="text-xs font-semibold text-stone-800">Zero Synthetic Wax</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6FAF7] border border-stone-200">
                  <Sparkles className="w-4 h-4 text-[#008C60] shrink-0" />
                  <span className="text-xs font-semibold text-stone-800">Eco-Carton Pack</span>
                </div>
              </div>
            </div>

            {/* Interactive Quantity & Add to Basket Section */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-[#F6FAF7] border border-stone-300 rounded-2xl p-1.5 shrink-0">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-white disabled:opacity-40 transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-black text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= inStock || isOutOfStock}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-white disabled:opacity-40 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Basket Button */}
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                    isAddedRecently
                      ? 'bg-emerald-800 text-white shadow-emerald-800/20'
                      : isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                      : 'bg-[#008C60] hover:bg-[#075B43] text-white shadow-[#008C60]/25'
                  }`}
                >
                  {isAddedRecently ? (
                    <>
                      <Check className="w-4 h-4 text-[#A3E635]" />
                      <span>Added to Basket!</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Basket · ₹{(currentProd.discountPrice || currentProd.price) * quantity}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  onClick={() => onToggleWishlist(currentProd.id || currentProd._id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition border shadow-xs cursor-pointer shrink-0 ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border-rose-300'
                      : 'bg-white text-stone-500 hover:text-rose-600 border-stone-300 hover:bg-rose-50'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {isOutOfStock && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>This harvest is fully reserved for today. Check back tomorrow at dawn!</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

