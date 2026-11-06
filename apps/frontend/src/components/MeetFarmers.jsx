import React from 'react';
import {
  Users,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Tractor,
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_FARMERS = [
  {
    farmerName: 'Rajesh Sharma',
    farmName: 'Sharma Alpine Orchards',
    location: 'Shimla, Himachal Pradesh',
    certifications: ['PGS-India Organic', 'Chemical-Free'],
    bio: 'High-altitude organic apple and cherry cultivation with pure Himalayan glacial meltwater.',
    rating: 4.9,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    specialty: 'Royal Gala & Golden Apples',
  },
  {
    farmerName: 'Vikram Joshi',
    farmName: 'Godavari Bio-Vines',
    location: 'Nashik, Maharashtra',
    certifications: ['GlobalGAP Compliant', 'Bio-Dynamic'],
    bio: 'Pesticide-free seedless table grapes and crimson pomegranates grown with natural agro-forestry compost.',
    rating: 4.8,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    specialty: 'Seedless Grapes & Pomegranates',
  },
  {
    farmerName: 'Sunita Deshmukh',
    farmName: 'Vidarbha Sun-Citrus Farms',
    location: 'Nagpur, Maharashtra',
    certifications: ['India Organic Certified', 'Zero Wax'],
    bio: 'Sun-kissed mandarin orange orchards grown without chemical wax sprays on fertile black cotton soil.',
    rating: 4.8,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    specialty: 'Nagpur Mandarins & Sweet Lime',
  },
];

export default function MeetFarmers({
  farmers = [],
  onExploreFarmerProducts,
  onOpenFarmerStorefront,
}) {
  const displayFarmers = farmers.length > 0 ? farmers : DEFAULT_FARMERS;

  return (
    <section id="farmers" className="py-16 sm:py-24 bg-[#F6FAF7] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#008C60] bg-emerald-100/80 px-3.5 py-1 rounded-full">
            <Tractor className="w-3.5 h-3.5 text-[#008C60]" />
            <span>Direct Fair Trade Community</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#191D1A] tracking-tight">
            Meet the Organic Farmers Behind Your Food
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Every fruit in our catalog is traceable to an accredited smallholder grower.
            We eliminate 4 to 6 traditional wholesale commission agents so growers earn honest value.
          </p>
        </div>

        {/* 3 Farmer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayFarmers.slice(0, 3).map((f, idx) => (
            <motion.div
              key={f.id || idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -35 : 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-emerald-200 overflow-hidden flex flex-col justify-between transition-all"
            >
              {/* Photo & Floating Verified Badge */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={f.image}
                  alt={f.farmerName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#075B43] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-[#008C60]" />
                  <span>Verified Grower</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3E635] bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                    {f.specialty || 'Organic Fruit Grower'}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-[#191D1A] leading-tight">
                      {f.farmerName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-stone-800">{f.rating || 4.9}</span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-[#008C60] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{f.farmName} • {f.location}</span>
                  </p>

                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                    {f.bio}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {(f.certifications || []).slice(0, 1).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-[#F6FAF7] text-stone-600 px-2 py-0.5 rounded border border-stone-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenFarmerStorefront && f.id) {
                        onOpenFarmerStorefront(f.id);
                      } else {
                        onExploreFarmerProducts(f.farmName || f.farmerName);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#008C60] hover:text-[#075B43] transition cursor-pointer"
                  >
                    <span>Visit Storefront</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

