import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  RotateCcw,
  MapPin,
  ChevronRight,
  X,
} from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function MyOrdersView({ onReorder, onNavigateTab }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getOrders({
        status: activeTab === 'all' ? undefined : activeTab,
        search: searchQuery,
      });
      setOrders(data?.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, searchQuery]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await customerApi.cancelOrder(orderId, 'Cancelled from Customer Dashboard');
      await fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'in_transit':
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
            <Truck className="w-3 h-3" />
            <span>In Transit</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-stone-900">My Orders</h2>
            <p className="text-xs text-stone-500">
              Track farm-to-table deliveries and past harvest purchases
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order # or item..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active & In Transit' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0a3d24] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-stone-200 p-6 animate-pulse space-y-3"
            >
              <div className="h-4 bg-stone-100 rounded-md w-1/4" />
              <div className="h-10 bg-stone-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <p className="text-4xl">📦</p>
          <h3 className="text-lg font-bold text-stone-800">No Orders in this Status</h3>
          <p className="text-xs text-stone-500">
            You don't have any orders matching your current filter.
          </p>
          <button
            onClick={() => onNavigateTab('shop')}
            className="px-6 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition"
          >
            Explore Fresh Harvests
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancel = ['pending', 'processing', 'accepted'].includes(order.status);
            return (
              <div
                key={order._id || order.orderNumber}
                className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm hover:border-emerald-200 transition"
              >
                {/* Header row: Order #, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-stone-900">
                        Order #{order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-500">Total Amount:</span>
                    <p className="text-base font-black text-[#0a3d24]">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Items preview */}
                <div className="py-4 space-y-2.5">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">
                          🍏
                        </div>
                        <div>
                          <p className="font-bold text-stone-800">{item.productName}</p>
                          <p className="text-[10px] text-stone-400">
                            Qty: {item.quantity} {item.unit || 'kg'} × ₹{item.unitPrice}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsTrackingOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}

                    <button
                      onClick={() => onReorder && onReorder(order)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0a3d24] hover:bg-[#072c1a] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRACKING MODAL */}
      {isTrackingOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsTrackingOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                Real-Time Delivery Status
              </span>
              <h3 className="text-xl font-black text-stone-900">
                Order #{selectedOrder.orderNumber}
              </h3>
            </div>

            {/* Timeline */}
            <div className="space-y-5 pl-4 relative">
              <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-stone-200" />
              {[
                { title: 'Order Confirmed', time: '10:24 AM', done: true },
                { title: 'Picked & Packed by Farmer', time: '11:10 AM', done: true },
                { title: 'Dispatched with Cold-Chain Courier', time: '01:45 PM', done: true },
                { title: 'Out for Doorstep Delivery', time: '02:30 PM', done: selectedOrder.status === 'in_transit' || selectedOrder.status === 'delivered', current: selectedOrder.status === 'in_transit' },
                { title: 'Delivered', time: 'Estimated by 5:00 PM', done: selectedOrder.status === 'delivered' },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 z-10">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      step.done
                        ? 'bg-emerald-600 text-white'
                        : step.current
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${step.done || step.current ? 'text-stone-900' : 'text-stone-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-stone-500">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">100% Guaranteed Freshness</p>
                <p className="text-emerald-700 text-[11px]">
                  All items transported inside eco-insulated cold packaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE PREVIEW MODAL */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-200 pb-4">
              <h3 className="text-xl font-black text-[#0a3d24]">FreshFruit Market</h3>
              <p className="text-xs text-stone-500">Official Tax Invoice & Receipt</p>
              <div className="mt-2 text-xs flex justify-between">
                <span>Invoice: #INV-{selectedOrder.orderNumber}</span>
                <span>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-stone-100 text-xs">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span>
                    {item.productName} ({item.quantity} {item.unit || 'kg'})
                  </span>
                  <span className="font-bold">₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs border-t border-stone-200 pt-3">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Discount / Coupon:</span>
                <span>-₹{selectedOrder.discount || 0}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery:</span>
                <span>₹{selectedOrder.deliveryCharge || 0}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 border-t border-stone-200 pt-2">
                <span>Total Paid:</span>
                <span className="text-[#0a3d24]">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition cursor-pointer"
            >
              Print / Save Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
