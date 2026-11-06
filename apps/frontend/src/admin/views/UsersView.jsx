import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Shield,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { adminApi } from '../adminApi';

export default function UsersView({ subTab, initialRole = 'all' }) {
  const getRoleFromSubTab = (tab) => {
    if (tab === 'users_customers') return 'customer';
    if (tab === 'users_sellers') return 'seller';
    if (tab === 'users_delivery') return 'delivery_partner';
    if (tab === 'users_support') return 'support_agent';
    return initialRole || 'all';
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState(() => getRoleFromSubTab(subTab));
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (subTab) {
      setRole(getRoleFromSubTab(subTab));
      setPage(1);
    } else if (initialRole) {
      setRole(initialRole);
      setPage(1);
    }
  }, [subTab, initialRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({
        role,
        search,
        status,
        page,
        limit: 10,
      });
      setUsers(data.users || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      console.error('[Fetch Users Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, status, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    setUpdatingId(user._id);
    try {
      await adminApi.updateUserStatus(user._id, !user.isActive);
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await adminApi.updateUserRole(userId, newRole);
      await fetchUsers();
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
            User Directory & Access Control
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage customer profiles, growers, logistics partners, and support agents
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-600 outline-hidden"
            />
          </form>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 font-semibold text-stone-700"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="seller">Sellers / Farmers</option>
            <option value="delivery_partner">Delivery Fleet</option>
            <option value="support_agent">Support Agents</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 bg-stone-50 font-semibold text-stone-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-6">User / Contact</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Registered On</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {u.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{u.name}</div>
                        <div className="text-stone-500 text-[11px] flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-stone-400" /> {u.email}
                          </span>
                          {u.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-stone-400" /> {u.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300 rounded-lg px-2 py-1 outline-hidden"
                    >
                      <option value="customer">customer</option>
                      <option value="seller">seller</option>
                      <option value="delivery_partner">delivery_partner</option>
                      <option value="support_agent">support_agent</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Deactivated
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-stone-500 font-medium">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      disabled={updatingId === u._id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                        u.isActive
                          ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-stone-400">
                    No users found matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Total: <strong>{pagination.total}</strong> records
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

