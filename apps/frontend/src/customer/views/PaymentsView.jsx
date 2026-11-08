import React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, FileText, ArrowRight, Banknote } from 'lucide-react';

export default function PaymentsView({ onNavigateTab }) {
  const transactions = [
    {
      id: 'tx-1',
      orderNumber: 'FF1245',
      date: 'Nov 6, 2026',
      amount: 420,
      mode: 'UPI / Razorpay',
      status: 'Paid',
    },
    {
      id: 'tx-2',
      orderNumber: 'FF1244',
      date: 'Nov 5, 2026',
      amount: 280,
      mode: 'Cash on Delivery',
      status: 'Pending',
    },
    {
      id: 'tx-3',
      orderNumber: 'FF1243',
      date: 'Nov 3, 2026',
      amount: 360,
      mode: 'UPI / Razorpay',
      status: 'Paid',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-700" />
          <h2 className="text-xl font-black text-stone-900">Payments & Invoices</h2>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          View past transaction receipts and billing history
        </p>
      </div>

      {/* Payment Security Badge */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-950">100% Encrypted & PCI-DSS Compliant</h4>
          <p className="text-xs text-emerald-800/80 mt-0.5">
            Your transactions and payment details are processed with end-to-end bank level 256-bit security.
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-stone-900">Transaction History</h3>

        <div className="divide-y divide-stone-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-stone-900">Order #{tx.orderNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tx.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <p className="text-stone-500 text-[11px]">{tx.date} • {tx.mode}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-stone-900">₹{tx.amount}</span>
                <button
                  onClick={() => onNavigateTab('orders')}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-emerald-700 hover:bg-stone-50 transition cursor-pointer"
                  title="View Invoice"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
