import React from 'react';
import {
  Sun,
  ShieldCheck,
  PackageCheck,
  Truck,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FarmProcess() {
  const steps = [
    {
      step: '01',
      title: 'Directly Harvested',
      subtitle: 'Peak Brix Plucking',
      description:
        'Harvested at 5 AM when ambient temperatures are cool and natural sugar concentration is at its peak. No artificial ripening chambers.',
      icon: Sun,
      highlight: 'Dawn Pluck',
    },
    {
      step: '02',
      title: 'Quality Checked',
      subtitle: 'Zero-Residue Testing',
      description:
        'Every batch is verified against multi-residue chemical standards. Graded into premium Size-A lots with zero synthetic waxing.',
      icon: ShieldCheck,
      highlight: '0.00 ppm Tested',
    },
    {
      step: '03',
      title: 'Safely Packed',
      subtitle: 'Plastic-Free Eco-Boxes',
      description:
        'Packaged in breathable, recyclable honeycomb cartons that protect delicate fruit blooms from transit abrasion.',
      icon: PackageCheck,
      highlight: '100% Recyclable',
    },
    {
      step: '04',
      title: 'Delivered Fresh',
      subtitle: 'Within 24 Hours',
      description:
        'Dispatched via temperature-regulated direct logistics. Arrives on your kitchen counter within 24 hours of being picked.',
      icon: Truck,
      highlight: '< 24h Transit',
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-24 bg-white border-y border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#008C60] bg-emerald-50 px-3.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#008C60]" />
            <span>Farm-To-Door Transparency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#191D1A] tracking-tight">
            How FreshFruit Works in 4 Steps
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Eliminating traditional multi-layer wholesale mandis to cut food miles and deliver unmatched orchard flavor.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="relative bg-[#F6FAF7] rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between text-left"
              >
                <div>
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-[#008C60]/30 font-mono">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-[#008C60]">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Highlight pill */}
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#075B43] bg-emerald-100 px-2 py-0.5 rounded-md mb-2">
                    {item.highlight}
                  </span>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-black text-[#191D1A] leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-[#008C60] mt-0.5">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-stone-600 leading-relaxed mt-3">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

