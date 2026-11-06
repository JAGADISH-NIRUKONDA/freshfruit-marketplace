import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, RotateCcw, CheckCircle, XCircle, DollarSign, Calendar } from 'lucide-react';
import { adminApi } from '../adminApi';

export default function PaymentsRefundsView({ initialTab = 'transactions', subTab }) {
  const [activeTab, setActiveTab] = useState(subTab === 'refunds' ? 'refunds' : initialTab);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState(
    subTab === 'payments_razorpay'
      ? 'razorpay'
      : subTab === 'payments_cod'
      ? 'cash_on_delivery'
      : 'all'
  );
  const [rejectModal, setRejectModal] = useState({ open: false, refundId: null, reason: '' });

  useEffect(() => {
    if (subTab === 'refunds') {
      setActiveTab('refunds');
    } else if (subTab === 'payments_razorpay') {
      setActiveTab('transactions');
      setMethodFilter('razorpay');
    } else if (subTab === 'payments_cod') {
      setActiveTab('transactions');
      setMethodFilter('cash_on_delivery');
    } else if (subTab === 'payments_transactions') {
      setActiveTab('transactions');
      setMethodFilter('all');
    }
  }, [subTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payData, refData] = await Promise.all([
        adminApi.getPayments(),
        adminApi.getRefunds(),
      ]);
      setPayments(payData.payments || []);
      setRefunds(refData.refunds || []);
    } catch (err) {
      console.error('[Payments Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRefund = async (id) => {
    if (!window.confirm('Approve this refund request and record payout?')) return;
    try {
      await adminApi.updateRefundDecision(id, 'approved');
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectRefundSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModal.reason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    try {
      await adminApi.updateRefundDecision(rejectModal.refundId, 'rejected', rejectModal.reason);
      setRejectModal({ open: false, refundId: null, reason: '' });
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (methodFilter === 'razorpay') return p.method === 'razorpay';
    if (methodFilter === 'cash_on_delivery') return p.method === 'cash_on_delivery';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'transactions'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Transactions ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('refunds')}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'refunds'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refund Management ({refunds.length})</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 font-semibold hidden sm:inline">
          Razorpay Webhook & COD Reconciliations
        </span>
      </div>

      {/* Transactions View */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-4 flex-wrap bg-stone-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 mr-2">Filter Method:</span>
              <button
                onClick={() => setMethodFilter('all')}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                  methodFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All ({payments.length})
              </button>
              <button
                onClick={() => setMethodFilter('razorpay')}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  methodFilter === 'razorpay'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Razorpay ({payments.filter(p => p.method === 'razorpay').length})</span>
              </button>
              <button
                onClick={() => setMethodFilter('cash_on_delivery')}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  methodFilter === 'cash_on_delivery'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash on Delivery ({payments.filter(p => p.method === 'cash_on_delivery').length})</span>
              </button>
            </div>
            <div className="text-xs text-stone-500 font-medium">
              Showing {filteredPayments.length} transactions
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Order #</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50/80 transition">
                    <td className="py-4 px-6 font-mono text-[11px] font-bold text-stone-900">
                      {p.transactionId}
                    </td>
                    <td className="py-4 px-6 font-mono text-stone-600">{p.orderNumber}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[11px]">
                        {p.method === 'razorpay' ? (
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {p.method}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-stone-900 text-sm">
                      ₹{p.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          p.status === 'captured'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-500 font-medium">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-stone-400">
                      No payment transactions found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refunds View */}
      {activeTab === 'refunds' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Order Number</th>
                  <th className="py-4 px-6">Refund Reason</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {refunds.map((r) => (
                  <tr key={r._id} className="hover:bg-stone-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-stone-900">
                      {r.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-stone-800">{r.reason}</div>
                      {r.rejectionReason && (
                        <div className="text-[11px] text-rose-600">Rejection: {r.rejectionReason}</div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-black text-stone-900 text-sm">
                      ₹{r.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          r.status === 'approved' || r.status === 'processed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {r.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveRefund(r._id)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-bold text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModal({ open: true, refundId: r._id, reason: '' })}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 rounded-lg font-bold text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {refunds.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-stone-400">
                      No refund requests submitted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">Reject Refund Request</h3>
            <form onSubmit={handleRejectRefundSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="Reason for refund decline (e.g. Produce verified delivered in fresh condition with photo proof)..."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 outline-hidden"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, refundId: null, reason: '' })}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

