import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  MapPin,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function CartCheckoutView({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
  onNavigateTab,
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(null);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const addr = await customerApi.getAddresses();
        setAddresses(addr || []);
        const def = addr.find((a) => a.isDefault) || addr[0];
        if (def) setSelectedAddressId(def._id);
      } catch (err) {
        console.error('Failed to load customer addresses:', err);
      }
    }
    loadAddresses();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.discountPrice || item.price || 100;
    return acc + price * (item.quantity || 1);
  }, 0);

  const deliveryCharge = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryCharge);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await customerApi.validateCoupon(couponCode, subtotal);
      setCouponDiscount(res.discount || 0);
      setAppliedCoupon(res.code || couponCode.toUpperCase());
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponDiscount(0);
      setAppliedCoupon('');
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    try {
      const selectedAddr = addresses.find((a) => a._id === selectedAddressId) || {
        recipientName: 'Jagadish',
        phone: '+91 98000 00003',
        street: '12 Farm Orchard Road',
        city: 'Shimla',
        state: 'Himachal Pradesh',
        pincode: '171001',
      };

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId || item.id || item._id,
          productName: item.name,
          unitPrice: item.discountPrice || item.price,
          unit: item.unit || 'kg',
          quantity: item.quantity || 1,
        })),
        deliveryAddress: selectedAddr,
        paymentMethod,
        couponCode: appliedCoupon,
      };

      const created = await customerApi.createOrder(orderData);
      setOrderCompleted(created);
      if (onOrderSuccess) onOrderSuccess(created);
    } catch (err) {
      alert(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-stone-900">Order Placed Successfully!</h2>
          <p className="text-xs text-stone-500 mt-1">
            Order <span className="font-bold text-[#0a3d24]">#{orderCompleted.orderNumber}</span> has been confirmed with our farm partner.
          </p>
        </div>

        <div className="bg-[#f4f8f5] rounded-2xl p-4 text-xs space-y-1 text-left border border-emerald-100">
          <div className="flex justify-between">
            <span className="text-stone-500">Total Amount:</span>
            <span className="font-black text-[#0a3d24]">₹{orderCompleted.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Payment Mode:</span>
            <span className="font-bold uppercase text-stone-800">{orderCompleted.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Estimated Delivery:</span>
            <span className="font-bold text-emerald-800">Within 24–48 Hours</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onNavigateTab('orders')}
            className="flex-1 py-3 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition cursor-pointer"
          >
            Track in My Orders
          </button>
          <button
            onClick={() => {
              setOrderCompleted(null);
              onNavigateTab('shop');
            }}
            className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
        <h2 className="text-xl font-black text-stone-900">Shopping Cart & Checkout</h2>
        <p className="text-xs text-stone-500">Review selected produce and confirm delivery</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">Your Basket is Empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Add fresh fruits, seasonal apples, and organic vegetables directly from farm orchards.
          </p>
          <button
            onClick={() => onNavigateTab('shop')}
            className="px-6 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition"
          >
            Shop Farm Produce
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Items List (7/12) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 space-y-3 shadow-sm divide-y divide-stone-100">
              {cartItems.map((item) => {
                const id = item.productId || item.id || item._id;
                const price = item.discountPrice || item.price || 100;
                const img =
                  item.image ||
                  item.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80';

                return (
                  <div key={id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={img}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-bold text-[#0a3d24]">
                          ₹{price} <span className="text-[10px] text-stone-400 font-normal">/{item.unit || 'kg'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-xl p-1">
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(id, -1)}
                          className="w-6 h-6 rounded-lg bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity || 1}</span>
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(id, 1)}
                          className="w-6 h-6 rounded-lg bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem && onRemoveItem(id)}
                        className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Address Selection */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-stone-900">Delivery Address</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('addresses')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                  <p className="font-bold text-stone-800">Primary Delivery Address (Default)</p>
                  <p>12 Farm Orchard Road, Shimla, Himachal Pradesh - 171001</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map((a) => (
                    <label
                      key={a._id}
                      className={`block p-3 rounded-2xl border text-xs cursor-pointer transition ${
                        selectedAddressId === a._id
                          ? 'border-emerald-600 bg-emerald-50/50'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={selectedAddressId === a._id}
                        onChange={() => setSelectedAddressId(a._id)}
                        className="sr-only"
                      />
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>{a.label} ({a.recipientName})</span>
                        {a.isDefault && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        {a.street}, {a.city}, {a.state} - {a.pincode}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900">Payment Option</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition cursor-pointer text-left ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50 text-[#0a3d24]'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Cash on Delivery</p>
                    <p className="text-[10px] text-stone-500">Pay when fresh at door</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition cursor-pointer text-left ${
                    paymentMethod === 'razorpay'
                      ? 'border-emerald-600 bg-emerald-50/50 text-[#0a3d24]'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">UPI / Cards</p>
                    <p className="text-[10px] text-stone-500">Instant instant payment</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Summary (5/12) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-stone-900">Order Summary</h3>

              {/* Coupon Input */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon (e.g. FRESH30)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] font-bold text-emerald-700">
                    ✓ Coupon {appliedCoupon} applied (-₹{couponDiscount})
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] font-bold text-rose-600">{couponError}</p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs border-t border-stone-100 pt-4">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span className="font-bold text-stone-900">₹{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount:</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge:</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-[10px] text-emerald-700">
                    Add ₹{Math.max(0, 500 - subtotal)} more for FREE delivery!
                  </p>
                )}
                <div className="flex justify-between text-base font-black text-stone-900 border-t border-stone-100 pt-3">
                  <span>Total Amount:</span>
                  <span className="text-xl text-[#0a3d24]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#0a3d24] hover:bg-[#072c1a] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure Checkout with FreshFruit Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
