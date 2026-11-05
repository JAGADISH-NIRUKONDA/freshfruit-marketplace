import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  FileText,
  DollarSign,
  ShoppingBag,
  Percent,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { adminApi } from '../adminApi';

export default function AnalyticsReportsView() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getReports()
      .then((data) => setReportsData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    if (!reportsData?.orders || reportsData.orders.length === 0) {
      alert('No order data available for export');
      return;
    }

    const headers = ['OrderNumber', 'Customer', 'TotalAmount', 'Status', 'PaymentMethod', 'PaymentStatus', 'CreatedAt'];
    const rows = reportsData.orders.map((o) => [
      o.orderNumber,
      `"${o.deliveryAddress?.recipientName || 'Customer'}"`,
      o.totalAmount,
      o.status,
      o.paymentMethod,
      o.paymentStatus,
      new Date(o.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FreshFruit_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = reportsData?.summary || {};

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Financial & Sales Audit Reports
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified performance reports computed directly from database ledgers
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Gross Sales Value
          </div>
          <div className="text-2xl font-black text-stone-900 mt-1">
            ₹{(summary.grossSales || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">All processed & active orders</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Net Paid Revenue
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{(summary.netRevenue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Verified captured funds</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Total Orders Logged
          </div>
          <div className="text-2xl font-black text-stone-900 mt-1">
            {summary.totalOrders || 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Platform checkout history</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Est. Commission (5%)
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            ₹{Math.round((summary.netRevenue || 0) * 0.05).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">Marketplace facilitation fee</div>
        </div>
      </div>

      {/* Audit Orders Snapshot */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
        <h3 className="font-extrabold text-stone-900 text-base">
          Recent Order Audit Log Snapshot
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {(reportsData?.orders || []).slice(0, 8).map((o) => (
                <tr key={o._id}>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                  <td className="py-3 px-4 text-stone-700">{o.deliveryAddress?.recipientName || 'Buyer'}</td>
                  <td className="py-3 px-4 font-black text-stone-900">₹{o.totalAmount}</td>
                  <td className="py-3 px-4 uppercase text-[11px]">{o.paymentMethod} ({o.paymentStatus})</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

