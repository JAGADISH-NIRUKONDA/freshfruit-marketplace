import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  {
    slug: 'fruits',
    name: 'Fruits',
    description: 'Crisp apples, sweet mangoes & tree-ripened orchard produce',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    productCount: 14,
  },
  {
    slug: 'vegetables',
    name: 'Vegetables',
    description: 'Farm-fresh carrots, crunchy root vegetables & daily garden crops',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    productCount: 12,
  },
  {
    slug: 'greens',
    name: 'Leafy Greens',
    description: 'Crisp spinach, tender butterhead lettuce & organic greens',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    productCount: 9,
  },
  {
    slug: 'citrus',
    name: 'Citrus Fruits',
    description: 'Sun-kissed vitamin-C rich mandarins, sweet limes & lemons',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    productCount: 8,
  },
  {
    slug: 'berries',
    name: 'Berries',
    description: 'Hand-picked strawberries, blueberries & seedless grapes',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
    productCount: 10,
  },
  {
    slug: 'baskets',
    name: 'Organic Baskets',
    description: 'Curated weekly farm assortments for conscious families',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    productCount: 6,
  },
];

export default function CategorySection({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  // Merge loaded categories with defaults to ensure all 6 image cards are rich and robust
  const displayCategories = categories.length > 0
    ? DEFAULT_CATEGORIES.map((def) => {
        const found = categories.find((c) => c.slug === def.slug || c.name.toLowerCase().includes(def.name.toLowerCase()));
        return found
          ? { ...def, ...found, productCount: found.productCount || def.productCount }
          : def;
      })
    : DEFAULT_CATEGORIES;

  return (
    <section className="py-16 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#008C60] bg-emerald-50 px-3 py-1 rounded-full mb-2">
              <Layers className="w-3.5 h-3.5 text-[#008C60]" />
              <span>Orchard Specialties</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#191D1A] tracking-tight">
              Explore Harvest Categories
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-xl">
              Organically cultivated produce sorted by variety, picked fresh at dawn from partner growers.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1 text-sm font-bold text-[#008C60] hover:text-[#075B43] transition self-start md:self-auto cursor-pointer"
          >
            <span>View All Produce</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Category Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {displayCategories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <motion.div
                key={cat.slug || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all text-left flex flex-col bg-[#F6FAF7] ${
                  isSelected
                    ? 'border-[#008C60] ring-2 ring-[#008C60] shadow-md shadow-[#008C60]/15'
                    : 'border-stone-200/80 hover:border-emerald-300 hover:shadow-lg hover:shadow-stone-200/50'
                }`}
              >
                {/* Category Image */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Product Count Pill */}
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                    {cat.productCount} items
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#191D1A] group-hover:text-[#008C60] transition leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 line-clamp-2 mt-1 hidden sm:block">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold text-[#008C60]">
                    <span>Browse</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

