import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { marketplaceApi } from '../../services/marketplaceApi';

export default function ShopProductsView({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenProductDetails,
  initialCategory = 'all',
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    async function loadShopData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          marketplaceApi.getProducts({
            category: selectedCategory,
            search: searchQuery,
            sort: sortBy,
            limit: 40,
          }),
          marketplaceApi.getCategories().catch(() => []),
        ]);

        const items = prodRes.products || prodRes || [];
        setProducts(items);

        if (catRes && catRes.length > 0) {
          setCategories(catRes);
        }
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadShopData();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAdd = (product) => {
    onAddToCart(product);
    const id = product.id || product._id;
    setAddedIds((prev) => [...prev, id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((i) => i !== id));
    }, 1500);
  };

  const allCategoryPills = [
    { id: 'all', name: 'All Produce', icon: '🧺' },
    { id: 'fruits', name: 'Fresh Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Farm Vegetables', icon: '🥕' },
    { id: 'citrus', name: 'Citrus & Berries', icon: '🍊' },
    { id: 'greens', name: 'Organic Greens', icon: '🥬' },
    { id: 'tropical', name: 'Exotic & Tropical', icon: '🥭' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Search & Filter Header Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fruits, vegetables, organic harvests..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#f8faf8] border border-stone-200 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-bold text-stone-600">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f8faf8] border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="newest">Recently Harvested</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {allCategoryPills.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#0a3d24] text-white shadow-sm'
                    : 'bg-[#f4f8f5] text-stone-700 hover:bg-[#e8fbf0] border border-stone-200/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3 animate-pulse"
            >
              <div className="w-full aspect-square bg-stone-100 rounded-2xl" />
              <div className="h-4 bg-stone-100 rounded-md w-3/4" />
              <div className="h-4 bg-stone-100 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <p className="text-3xl">🧺</p>
          <h3 className="text-lg font-bold text-stone-800">No Produce Found</h3>
          <p className="text-xs text-stone-500">
            We couldn't find any items matching "{searchQuery}". Try a different keyword or category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const pId = product.id || product._id;
            const isWish = wishlistIds.includes(pId);
            const isAdded = addedIds.includes(pId);
            const img =
              product.image ||
              product.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80';
            const price = product.discountPrice || product.price || 120;
            const origPrice = product.originalPrice || product.compareAtPrice || Math.round(price * 1.25);
            const rating = product.rating?.average || product.rating || 4.8;
            const reviews = product.rating?.count || product.reviews || 120;

            return (
              <div
                key={pId}
                className="group bg-white rounded-3xl border border-stone-200/80 p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg transition duration-200 hover:border-emerald-200 relative"
              >
                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(pId)}
                  className={`absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-xs cursor-pointer ${
                    isWish
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-white/80 hover:bg-white text-stone-500 hover:text-rose-500 border border-stone-200/60'
                  }`}
                  title={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
                </button>

                {/* Product Image */}
                <div
                  onClick={() => onOpenProductDetails && onOpenProductDetails(product)}
                  className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-50 mb-3 cursor-pointer"
                >
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.isOrganic && (
                    <span className="absolute bottom-2 left-2 bg-emerald-800/85 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      100% Organic
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      {product.farm || 'Sharma Orchards'}
                    </p>
                    <h4
                      onClick={() => onOpenProductDetails && onOpenProductDetails(product)}
                      className="text-xs sm:text-sm font-extrabold text-stone-900 line-clamp-1 hover:text-emerald-700 cursor-pointer"
                    >
                      {product.name}
                    </h4>
                  </div>

                  {/* Rating & Stock */}
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rating}</span>
                      <span className="text-stone-400 font-normal">({reviews})</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      In Stock
                    </span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-black text-[#0a3d24]">
                        ₹{price}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        /{product.unit || 'kg'}
                      </span>
                      {origPrice > price && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ₹{origPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0a3d24] hover:bg-[#072c1a] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
