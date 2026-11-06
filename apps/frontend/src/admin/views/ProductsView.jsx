import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminApi } from '../adminApi';

export default function ProductsView({ subTab, filterStatus = 'all' }) {
  const getInitialStatus = (tab) => {
    if (tab === 'product_approvals') return 'pending_approval';
    return filterStatus || 'all';
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(() => getInitialStatus(subTab));
  const [grade, setGrade] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  useEffect(() => {
    if (subTab) {
      setStatus(getInitialStatus(subTab));
      setPage(1);
    } else if (filterStatus) {
      setStatus(filterStatus);
      setPage(1);
    }
  }, [subTab, filterStatus]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts({
        status,
        grade,
        search,
        page,
        limit: 10,
      });
      setProducts(data.products || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      console.error('[Fetch Products Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, grade, page]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminApi.updateProductStatus(id, newStatus);
      await fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Marketplace Produce Catalogue
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit fruit & vegetable quality grades, verify harvest dates, and manage listings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            placeholder="Search produce name..."
            className="text-xs px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-hidden w-56"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Marketplace</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="rejected">Rejected Listings</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 font-semibold"
          >
            <option value="all">All Grades</option>
            <option value="A">Grade A (Premium)</option>
            <option value="B">Grade B (Standard)</option>
            <option value="C">Grade C (Processing)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-6">Produce Item</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Quality Grade</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock Left</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80'}
                        alt={p.name}
                        className="w-11 h-11 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-stone-900 text-sm leading-tight">{p.name}</div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          {p.sellerId?.name || 'Local Farm'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-stone-600 font-semibold">
                    {p.categoryId?.name || 'Produce'}
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 font-bold text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Award className="w-3 h-3 text-emerald-600" /> Grade {p.grade}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-black text-stone-900 text-sm">₹{p.price}</span>
                    <span className="text-[11px] text-stone-500"> / {p.unit}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`font-bold ${
                        p.availableQuantity <= 10 ? 'text-rose-600 flex items-center gap-1' : 'text-stone-800'
                      }`}
                    >
                      {p.availableQuantity <= 10 && <AlertTriangle className="w-3.5 h-3.5" />}
                      {p.availableQuantity} units
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        p.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'pending_approval'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.status !== 'active' && (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'active')}
                          className="px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200"
                        >
                          Approve
                        </button>
                      )}
                      {p.status === 'active' && (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'suspended')}
                          className="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg border border-rose-200"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Total: <strong>{pagination.total}</strong> products
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
    </div>
  );
}

