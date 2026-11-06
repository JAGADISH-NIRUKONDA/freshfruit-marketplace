import React from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  Leaf,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedOrchard({ onExploreFarm, onOpenFarmerStorefront }) {
  return (
    <section className="py-16 sm:py-20 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#075B43] text-white shadow-2xl">
          {/* Subtle Organic Background Details */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
              alt="Orchard background"
              className="w-full h-full object-cover opacity-20 filter blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#075B43] via-[#075B43]/95 to-[#075B43]/80" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            {/* Left Column: Farm Profile Story */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Verification & Spotlight Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#008C60]/80 border border-emerald-400/40 text-[#A3E635] text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                  <span>Verified Organic Farm</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Orchard of the Month</span>
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Sharma Alpine Orchards
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-emerald-200 text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#A3E635]" />
                    Shimla Hills, Himachal Pradesh (7,200 ft)
                  </span>
                  <span className="text-emerald-400">•</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <strong className="text-white">4.9</strong> (84 verified customer reviews)
                  </span>
                </div>
              </div>

              {/* Story Description */}
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal">
                "Our family has stewarded these Himalayan slopes for three generations without synthetic pesticides or chemical wax coatings. Our apples and cherries are fed entirely by glacial runoff and high-altitude sunshine, handpicked in dawn mist and packaged directly in eco-ventilated cartons."
              </p>

              {/* Farm Credentials Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">Certification</span>
                  <span className="text-xs font-black text-white block mt-0.5">PGS-India Organic</span>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">Acreage</span>
                  <span className="text-xs font-black text-white block mt-0.5">18.5 Acres Natural</span>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-2xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">Pesticide Residue</span>
                  <span className="text-xs font-black text-[#A3E635] block mt-0.5">0.00 ppm Tested</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onOpenFarmerStorefront) {
                      onOpenFarmerStorefront('Sharma Alpine Orchards');
                    } else {
                      onExploreFarm('Sharma Alpine Orchards');
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-[#A3E635] hover:bg-lime-400 text-stone-950 font-black text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-lg transition cursor-pointer"
                >
                  <span>Explore Sharma Farm Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Imagery Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 aspect-3/4">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80"
                    alt="Rajesh Sharma Farmer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                  <p className="text-xs font-bold text-white">Rajesh Sharma</p>
                  <p className="text-[10px] text-emerald-200">Lead Master Grower</p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="bg-[#008C60]/40 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-400/20 text-center">
                  <CheckCircle2 className="w-6 h-6 text-[#A3E635] mx-auto mb-1" />
                  <p className="text-xs font-black text-white">100% Direct Fair Pay</p>
                  <p className="text-[10px] text-emerald-200">Zero broker commissions</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"
                    alt="Himachal Royal Gala Apples"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

