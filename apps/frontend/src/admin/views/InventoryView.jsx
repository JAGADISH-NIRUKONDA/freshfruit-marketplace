import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  CheckCircle,
  Package,
} from 'lucide-react';
import { adminApi } from '../adminApi';

export default function InventoryView() {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [adjustModal, setAdjustModal] = useState({ open: false, product: null, adjustment: 0, reason: '' });

  const fetchInventory = async () => {
    try {
      const data = await adminApi.getInventory({ search, lowStockOnly });
      setInventory(data.inventory || []);
      setSummary(data.summary || {});
    } catch (err) {
      console.error('[Inventory Error]', err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustModal.product) return;
    try {
      await adminApi.adjustStock(adjustModal.product._id, adjustModal.adjustment, adjustModal.reason);
      setAdjustModal({ open: false, product: null, adjustment: 0, reason: '' });
      await fetchInventory();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Total Warehouse Units
          </div>
          <div className="text-2xl font-black text-stone-900 mt-1">
            {summary.totalStockUnits || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Available for sale</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Reserved Cart Units
          </div>
          <div className="text-2xl font-black text-stone-900 mt-1">
            {summary.totalReservedUnits || 0}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Awaiting checkout</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Low Stock Alerts
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {summary.lowStockCount || 0}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">&lt; 10 units left</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Out of Stock Items
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {summary.outOfStockCount || 0}
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">Restock urgently</div>
        </div>
      </div>

      {/* Table & Controls */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-stone-900 text-base">Produce Inventory Levels</h3>
            <p className="text-xs text-stone-500">Real-time stock audit and manual adjustments</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLowStockOnly(!lowStockOnly)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                lowStockOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              Low Stock Only
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-6">Produce Item</th>
                <th className="py-4 px-6">Orchard Source</th>
                <th className="py-4 px-6">Available Stock</th>
                <th className="py-4 px-6">Reserved</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventory.map((p) => (
                <tr key={p._id} className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-stone-900 text-sm">{p.name}</div>
                    <div className="text-[11px] text-stone-500">{p.unit}</div>
                  </td>

                  <td className="py-4 px-6 text-stone-700 font-medium">
                    {p.sellerId?.name || 'Local Farm'}
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-black text-stone-900 text-sm">{p.availableQuantity}</span>
                    <span className="text-[11px] text-stone-400"> units</span>
                  </td>

                  <td className="py-4 px-6 text-stone-600 font-semibold">
                    {p.reservedQuantity || 0} units
                  </td>

                  <td className="py-4 px-6">
                    {p.availableQuantity === 0 ? (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    ) : p.availableQuantity <= 10 ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() =>
                        setAdjustModal({
                          open: true,
                          product: p,
                          adjustment: 0,
                          reason: 'Warehouse physical audit count',
                        })
                      }
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 transition"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModal.open && adjustModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">Adjust Stock Quantity</h3>
            <p className="text-xs text-stone-500">
              Product: <strong>{adjustModal.product.name}</strong> (Current:{' '}
              {adjustModal.product.availableQuantity} units)
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Stock Delta Adjustment (+ to add, - to subtract)
                </label>
                <input
                  type="number"
                  required
                  value={adjustModal.adjustment}
                  onChange={(e) =>
                    setAdjustModal({ ...adjustModal, adjustment: Number(e.target.value) })
                  }
                  className="w-full text-sm font-black p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Reason for Adjustment (Recorded in Audit Log)
                </label>
                <input
                  type="text"
                  required
                  value={adjustModal.reason}
                  onChange={(e) => setAdjustModal({ ...adjustModal, reason: e.target.value })}
                  placeholder="e.g. Received new farm crate delivery / damaged in transit"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModal({ open: false, product: null, adjustment: 0, reason: '' })}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

