import React from 'react';
import { Leaf, Phone, Mail, MapPin, Shield, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onNavigateToAdmin, onCategoryClick }) {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800 text-left">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#008C60] flex items-center justify-center text-white shadow-md shadow-[#008C60]/30">
                <Leaf className="w-5 h-5 text-[#A3E635]" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                FreshFruit<span className="text-[#008C60]">.</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Empowering certified organic smallholder growers with direct market access and fair pricing, while delivering 100% wax-free, residue-tested harvests to families within 24 hours of plucking.
            </p>
            <div className="pt-2 flex items-center gap-2 text-stone-300">
              <span className="text-[11px] text-stone-500">Certified by:</span>
              <span className="text-[10px] bg-stone-900 border border-stone-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                PGS-India Organic Board
              </span>
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Seasonal Produce
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onCategoryClick?.('fruits')}
                  className="hover:text-white transition text-stone-400 cursor-pointer"
                >
                  Himalayan Royal Apples
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick?.('tropical')}
                  className="hover:text-white transition text-stone-400 cursor-pointer"
                >
                  Ratnagiri Alphonso
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick?.('berries')}
                  className="hover:text-white transition text-stone-400 cursor-pointer"
                >
                  Mahabaleshwar Strawberries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick?.('citrus')}
                  className="hover:text-white transition text-stone-400 cursor-pointer"
                >
                  Nagpur Sweet Mandarins
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick?.('baskets')}
                  className="hover:text-white transition text-stone-400 cursor-pointer"
                >
                  Weekly Family Harvest Box
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Governance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Community & Growers
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#farmers" className="hover:text-white transition">
                  Partner Orchards
                </a>
              </li>
              <li>
                <a href="#seller-cta" className="hover:text-white transition">
                  Grower Onboarding Rules
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition">
                  Multi-Residue Testing Lab
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition">
                  Zero Plastic Honeycomb Box
                </a>
              </li>
              <li>
                <button
                  onClick={onNavigateToAdmin}
                  className="hover:text-[#A3E635] text-stone-400 transition flex items-center gap-1.5 cursor-pointer pt-1"
                >
                  <Shield className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Admin Operations Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Helpdesk
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#008C60]" />
                <span>+91 98000 00000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#008C60]" />
                <span>harvest@freshfruit.local</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#008C60]" />
                <span>Nashik Agri-Tech Corridor</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights & Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} FreshFruit Market. Handcrafted with organic integrity.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-stone-300 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-stone-300 transition">
              Terms of Fair Trade
            </a>
            <a href="#" className="hover:text-stone-300 transition">
              Residue Lab Certificates
            </a>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-3 text-stone-400">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#A3E635] transition">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#A3E635] transition">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#A3E635] transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

