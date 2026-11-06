import React from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  if (!isOpen) return null;

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
            <div className="w-9 h-9 rounded-xl bg-[#008C60] flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5 text-[#A3E635]" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-base leading-tight">
                Your Harvest Basket
              </h3>
              <p className="text-[11px] text-stone-500">
                {totalItems} {totalItems === 1 ? 'produce item' : 'produce items'} from direct farms
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

        {/* Cart Items Scroll List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cart.map((item) => (
            <div
              key={item.id || item._id}
              className="flex gap-3.5 p-3.5 rounded-2xl border border-stone-200 bg-white shadow-2xs hover:border-emerald-200 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-18 h-18 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-100"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {item.unit} • {item.farm}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100">
                  <span className="text-xs font-black text-stone-900">
                    ₹{item.price * item.quantity}
                  </span>

                  <div className="flex items-center gap-1.5 bg-[#F6FAF7] rounded-lg p-1 border border-stone-200">
                    <button
                      onClick={() => onUpdateQuantity(item.id || item._id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1 text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id || item._id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id || item._id)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition ml-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-center py-24 text-stone-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F6FAF7] mx-auto flex items-center justify-center text-stone-300">
                <ShoppingBag className="w-8 h-8 text-[#008C60]/40" />
              </div>
              <h4 className="text-sm font-bold text-stone-700">Your basket is currently empty</h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Explore today's peak harvest catalog and add fresh, chemical-free fruits!
              </p>
            </div>
          )}
        </div>

        {/* Drawer Summary & Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-[#F6FAF7] space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#008C60]" />
                  Zero-Plastic Honeycomb Packaging
                </span>
                <span className="text-[#008C60] font-black text-[11px]">FREE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cold-Chain Courier Dispatch</span>
                <span className="text-[#008C60] font-black text-[11px]">FREE</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Amount</p>
                <p className="text-xl font-black text-stone-900">₹{subtotal}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                Guaranteed Fresh
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-[#008C60] hover:bg-[#075B43] text-white font-bold py-3.5 rounded-2xl shadow-md shadow-[#008C60]/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition cursor-pointer"
            >
              <span>Proceed to Organic Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

