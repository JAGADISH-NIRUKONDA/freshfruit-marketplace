import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles, SlidersHorizontal, Search, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  sortOption,
  onSortChange,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  onRefresh,
  onOpenDetails,
}) {
  const categoryFilters = [
    { id: 'all', label: 'All Harvests' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'greens', label: 'Leafy Greens' },
    { id: 'citrus', label: 'Citrus Fruits' },
    { id: 'berries', label: 'Berries' },
    { id: 'organic', label: 'Organic Products' },
    { id: 'baskets', label: 'Organic Baskets' },
  ];

  return (
    <section id="produce" className="py-16 sm:py-20 bg-[#F6FAF7] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#008C60] bg-[#008C60]/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#008C60]" />
              <span>Direct From Field</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#191D1A] tracking-tight">
              Today's Fresh Harvest
            </h2>
            <p className="text-stone-600 text-sm max-w-xl">
              Plucked this morning across verified organic orchards in Himachal, Konkan, and Nashik.
              Tested 100% chemical residue-free.
            </p>
          </div>

          {/* Sort & Refresh Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-stone-200/80 shadow-2xs">
              <SlidersHorizontal className="w-4 h-4 text-stone-500" />
              <label htmlFor="harvest-sort" className="text-xs font-semibold text-stone-500">
                Sort:
              </label>
              <select
                id="harvest-sort"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-xs font-bold text-stone-800 bg-transparent outline-hidden cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <button
              onClick={onRefresh}
              title="Refresh live harvest from MongoDB"
              className="p-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 hover:text-[#008C60] transition shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryFilters.map((tab) => {
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#008C60] text-white shadow-md shadow-[#008C60]/20'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Search Filter Banner */}
        {searchQuery && (
          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-stone-200 text-xs">
            <span className="text-stone-600">
              Showing search results for <strong className="text-stone-900">"{searchQuery}"</strong> ({products.length} found)
            </span>
            <button
              onClick={onClearSearch}
              className="text-[#008C60] font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Loading Shimmer Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-stone-200 p-4 space-y-4 animate-pulse"
              >
                <div className="w-full aspect-4/3 bg-stone-200 rounded-2xl" />
                <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                <div className="h-3 bg-stone-200 rounded-md w-1/2" />
                <div className="h-8 bg-stone-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(product.id || product._id)}
                onToggleWishlist={onToggleWishlist}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F6FAF7] mx-auto flex items-center justify-center text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">No produce matching your criteria</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try adjusting your search keywords or switching category filters to discover fresh organic produce.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onClearSearch();
              }}
              className="inline-flex items-center gap-2 bg-[#008C60] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-[#075B43] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

