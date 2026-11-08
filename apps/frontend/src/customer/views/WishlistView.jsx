import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function WishlistView({
  onMoveToCart,
  onNavigateTab,
  onOpenProductDetails,
}) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getWishlist();
      setWishlistItems(data?.items || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await customerApi.toggleWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => (item.productId || item._id) !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-black text-stone-900">My Wishlist</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {wishlistItems.length} seasonal produce items saved for later
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('shop')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-800 transition cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3 animate-pulse"
            >
              <div className="w-full aspect-square bg-stone-100 rounded-2xl" />
              <div className="h-4 bg-stone-100 rounded-md" />
            </div>
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Save your favorite farm-fresh fruits, citrus and vegetables so you never miss a seasonal harvest.
          </p>
          <button
            onClick={() => onNavigateTab('shop')}
            className="px-6 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition"
          >
            Explore Fresh Fruits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((item) => {
            const id = item.productId || item._id;
            return (
              <div
                key={id}
                className="group bg-white rounded-3xl border border-stone-200/80 p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg transition hover:border-emerald-200 relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(id)}
                  className="absolute top-5 right-5 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center shadow-xs transition cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Image */}
                <div
                  onClick={() => onOpenProductDetails && onOpenProductDetails(item)}
                  className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-50 mb-3 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {item.inStock ? (
                    <span className="absolute bottom-2 left-2 bg-emerald-700/85 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="absolute bottom-2 left-2 bg-stone-800/85 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <h4
                    onClick={() => onOpenProductDetails && onOpenProductDetails(item)}
                    className="text-xs sm:text-sm font-bold text-stone-900 truncate hover:text-emerald-700 cursor-pointer"
                  >
                    {item.name}
                  </h4>

                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-[#0a3d24]">₹{item.price}</span>
                    <span className="text-[11px] text-stone-500 font-medium">/{item.unit || 'kg'}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-[10px] text-stone-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onMoveToCart && onMoveToCart(item);
                      handleRemove(id);
                    }}
                    className="w-full py-2 rounded-xl bg-[#0a3d24] hover:bg-[#072c1a] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
