import React from 'react';
import {
  Heart,
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds = [],
  products = [],
  onRemoveFromWishlist,
  onAddToCart,
  onOpenProductDetails,
}) {
  if (!isOpen) return null;

  // Filter products that are in wishlist
  const wishlistedProducts = products.filter((p) =>
    wishlistIds.includes(p.id || p._id)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-in Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-stone-200"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#F6FAF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-base leading-tight">
                Saved Harvests
              </h3>
              <p className="text-[11px] text-stone-500">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item saved' : 'items saved'} for later
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items Scroll List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {wishlistedProducts.map((item) => {
            const isOutOfStock = (item.inStock || 0) <= 0;
            return (
              <div
                key={item.id || item._id}
                className="flex gap-3.5 p-3.5 rounded-2xl border border-stone-200 bg-white shadow-2xs hover:border-emerald-200 transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => {
                    onClose();
                    onOpenProductDetails(item);
                  }}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-100 cursor-pointer hover:opacity-90"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          onClose();
                          onOpenProductDetails(item);
                        }}
                        className="text-xs font-black text-stone-900 leading-tight hover:text-[#008C60] cursor-pointer"
                      >
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(item.id || item._id)}
                        className="text-stone-400 hover:text-rose-600 p-0.5 transition cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {item.unit} • {item.farm}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100">
                    <span className="text-xs font-black text-stone-900">
                      ₹{item.discountPrice || item.price}
                    </span>

                    <button
                      onClick={() => onAddToCart({ ...item, quantity: 1 })}
                      disabled={isOutOfStock}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        isOutOfStock
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-[#008C60] hover:bg-[#075B43] text-white shadow-xs'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Move to Basket'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {wishlistedProducts.length === 0 && (
            <div className="text-center py-24 text-stone-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 mx-auto flex items-center justify-center text-rose-300">
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <h4 className="text-sm font-bold text-stone-700">No saved produce items</h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Tap the heart on any orchard fruit to save it for quick access!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-[#F6FAF7] flex justify-between items-center text-xs">
            <span className="text-stone-500 font-medium">
              Save seasonal crops to watch for fresh plucks
            </span>
            <button
              onClick={() => {
                wishlistedProducts.forEach((p) => {
                  if ((p.inStock || 0) > 0) onAddToCart({ ...p, quantity: 1 });
                });
              }}
              className="text-[#008C60] font-bold hover:underline cursor-pointer"
            >
              Add All In Stock
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

