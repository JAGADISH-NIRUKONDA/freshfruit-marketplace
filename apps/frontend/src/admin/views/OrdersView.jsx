import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  MapPin,
  Calendar,
} from 'lucide-react';
import { adminApi } from '../adminApi';

export default function OrdersView({ initialStatus = 'all' }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatusModal, setUpdateStatusModal] = useState({ open: false, order: null, newStatus: '', note: '' });

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrders({
        status,
        search,
        page,
        limit: 10,
      });
      setOrders(data.orders || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      console.error('[Fetch Orders Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!updateStatusModal.order || !updateStatusModal.newStatus) return;
    try {
      await adminApi.updateOrderStatus(
        updateStatusModal.order._id,
        updateStatusModal.newStatus,
        updateStatusModal.note
      );
      setUpdateStatusModal({ open: false, order: null, newStatus: '', note: '' });
      await fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Order Fulfillment & Operations
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit customer checkout carts, status lifecycles, and dispatch tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            placeholder="Search order #, customer, city..."
            className="text-xs px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-hidden w-60"
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 font-semibold"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-6">Order Number</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Fulfillment Status</th>
                <th className="py-4 px-6">Order Date</th>
                <th className="py-4 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6 font-mono font-bold text-stone-900 text-xs">
                    {o.orderNumber}
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-bold text-stone-900">{o.deliveryAddress?.recipientName || o.customerId?.name || 'Customer'}</div>
                    <div className="text-[11px] text-stone-500">{o.deliveryAddress?.city || 'Pune'}</div>
                  </td>

                  <td className="py-4 px-6 font-black text-stone-900 text-sm">
                    ₹{o.totalAmount}
                  </td>

                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                      {o.paymentMethod === 'razorpay' ? (
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Banknote className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>{o.paymentMethod}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                        o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        o.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'in_transit'
                          ? 'bg-sky-100 text-sky-800'
                          : o.status === 'processing'
                          ? 'bg-amber-100 text-amber-800'
                          : o.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-stone-500 font-medium">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setUpdateStatusModal({
                            open: true,
                            order: o,
                            newStatus: o.status,
                            note: '',
                          })
                        }
                        className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      >
                        Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    No orders matching selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Total: <strong>{pagination.total}</strong> orders
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold">
              Page {page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-500">Order Summary</span>
                <h3 className="text-lg font-black text-stone-900 font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-800 text-xs font-bold px-2 py-1"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-800">Delivery Address:</div>
                <div>{selectedOrder.deliveryAddress?.recipientName} ({selectedOrder.deliveryAddress?.phone})</div>
                <div className="text-stone-500">
                  {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city},{' '}
                  {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-700">Purchased Items:</div>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-900">{it.productName}</div>
                      <div className="text-stone-500 text-[11px]">
                        ₹{it.unitPrice} × {it.quantity} {it.unit}
                      </div>
                    </div>
                    <div className="font-black text-stone-900">₹{it.subtotal}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between text-xs font-bold text-emerald-950">
                <span>Grand Total:</span>
                <span className="text-base font-black">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Transition Modal */}
      {updateStatusModal.open && updateStatusModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">
              Update Order Status: {updateStatusModal.order.orderNumber}
            </h3>
            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">New Status</label>
                <select
                  value={updateStatusModal.newStatus}
                  onChange={(e) =>
                    setUpdateStatusModal({ ...updateStatusModal, newStatus: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 font-bold"
                >
                  <option value="pending">pending</option>
                  <option value="processing">processing</option>
                  <option value="dispatched">dispatched</option>
                  <option value="in_transit">in_transit</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                  <option value="returned">returned</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Status Note / Dispatch Tracking Number
                </label>
                <input
                  type="text"
                  value={updateStatusModal.note}
                  onChange={(e) =>
                    setUpdateStatusModal({ ...updateStatusModal, note: e.target.value })
                  }
                  placeholder="e.g. Package dispatched via cold-chain van #4"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateStatusModal({ open: false, order: null, newStatus: '', note: '' })}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

