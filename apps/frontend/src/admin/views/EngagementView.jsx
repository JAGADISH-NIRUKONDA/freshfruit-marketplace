import React, { useState, useEffect } from 'react';
import {
  Star,
  Tag,
  MessageSquare,
  Bell,
  CheckCircle,
  XCircle,
  Plus,
  Send,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../adminApi';

export default function EngagementView({ initialTab = 'reviews' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & form state
  const [couponModal, setCouponModal] = useState({ open: false, code: '', type: 'fixed', value: 50, minOrderAmount: 200, expiresAt: '' });
  const [notifModal, setNotifModal] = useState({ open: false, title: '', message: '', targetRole: 'all', type: 'system' });
  const [replyTicketModal, setReplyTicketModal] = useState({ open: false, ticket: null, message: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [revData, coupData, tickData, notifData] = await Promise.all([
        adminApi.getReviews(),
        adminApi.getCoupons(),
        adminApi.getSupportTickets(),
        adminApi.getNotifications(),
      ]);
      setReviews(revData || []);
      setCoupons(coupData || []);
      setTickets(tickData || []);
      setNotifications(notifData || []);
    } catch (err) {
      console.error('[Engagement Load Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModerateReview = async (id, status) => {
    try {
      await adminApi.moderateReview(id, status);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCoupon(couponModal);
      setCouponModal({ open: false, code: '', type: 'fixed', value: 50, minOrderAmount: 200, expiresAt: '' });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await adminApi.sendNotification(notifModal);
      setNotifModal({ open: false, title: '', message: '', targetRole: 'all', type: 'system' });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReplyTicket = async (e) => {
    e.preventDefault();
    if (!replyTicketModal.ticket) return;
    try {
      await adminApi.replySupportTicket(replyTicketModal.ticket._id, replyTicketModal.message);
      setReplyTicketModal({ open: false, ticket: null, message: '' });
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center gap-2">
        {[
          { id: 'reviews', label: 'Reviews & Ratings', icon: Star, count: reviews.length },
          { id: 'coupons', label: 'Coupons & Discounts', icon: Tag, count: coupons.length },
          { id: 'support', label: 'Customer Support Tickets', icon: MessageSquare, count: tickets.length },
          { id: 'notifications', label: 'Broadcast Notifications', icon: Bell, count: notifications.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === tab.id ? 'bg-lime-400 text-stone-950' : 'bg-stone-200 text-stone-700'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        rev.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-stone-900 text-sm leading-tight">
                    {rev.title || 'Produce Review'}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    "{rev.body || rev.comment}"
                  </p>

                  <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                    Product: <strong className="text-stone-700">{rev.productId?.name || 'Organic Harvest'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  {rev.status !== 'published' ? (
                    <button
                      onClick={() => handleModerateReview(rev._id, 'published')}
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2 rounded-xl border border-emerald-200"
                    >
                      Approve & Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerateReview(rev._id, 'hidden')}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2 rounded-xl"
                    >
                      Hide Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Coupons Manager */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setCouponModal({ ...couponModal, open: true })}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 tracking-wider">
                      {c.code}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div className="text-xl font-black text-stone-900">
                    {c.type === 'fixed' ? `₹${c.value} OFF` : `${c.value}% OFF`}
                  </div>

                  <p className="text-xs text-stone-500">
                    Min order requirement: <strong>₹{c.minOrderAmount || 0}</strong>
                  </p>

                  <div className="text-xs text-stone-400">
                    Used: {c.usedCount || 0} / {c.usageLimit || 100} times
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-end">
                  <button
                    onClick={() => adminApi.toggleCoupon(c._id, !c.isActive).then(loadData)}
                    className="text-xs font-bold text-stone-600 hover:text-emerald-700"
                  >
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Support Tickets */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Ticket ID</th>
                  <th className="py-4 px-6">Subject / Description</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-stone-50/80 transition">
                    <td className="py-4 px-6 font-mono font-bold text-stone-900">{t.ticketNumber}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-stone-900">{t.subject}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-sm">{t.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          t.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setReplyTicketModal({ open: true, ticket: t, message: '' })}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200"
                      >
                        Reply / Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setNotifModal({ ...notifModal, open: true })}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Alert</span>
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="p-4 rounded-2xl border border-stone-200 bg-white shadow-2xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{n.title}</h4>
                    <p className="text-xs text-stone-500">{n.message}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded">
                  Target: {n.targetRole}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {couponModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">Create Discount Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HARVEST20"
                  value={couponModal.code}
                  onChange={(e) => setCouponModal({ ...couponModal, code: e.target.value.toUpperCase() })}
                  className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Discount Value (₹ or %)</label>
                <input
                  type="number"
                  required
                  value={couponModal.value}
                  onChange={(e) => setCouponModal({ ...couponModal, value: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={couponModal.expiresAt}
                  onChange={(e) => setCouponModal({ ...couponModal, expiresAt: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCouponModal({ ...couponModal, open: false })}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Alert Modal */}
      {notifModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">Broadcast Alert to Marketplace</h3>
            <form onSubmit={handleSendNotification} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik Harvest Season Opening"
                  value={notifModal.title}
                  onChange={(e) => setNotifModal({ ...notifModal, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Notification Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type broadcast text..."
                  value={notifModal.message}
                  onChange={(e) => setNotifModal({ ...notifModal, message: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Target Group</label>
                <select
                  value={notifModal.targetRole}
                  onChange={(e) => setNotifModal({ ...notifModal, targetRole: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 font-bold"
                >
                  <option value="all">All Users & Visitors</option>
                  <option value="customer">Customers Only</option>
                  <option value="seller">Sellers & Farmers</option>
                  <option value="delivery_partner">Delivery Fleet</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNotifModal({ ...notifModal, open: false })}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Ticket Modal */}
      {replyTicketModal.open && replyTicketModal.ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">
              Reply to Ticket: {replyTicketModal.ticket.ticketNumber}
            </h3>
            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              "{replyTicketModal.ticket.description}"
            </p>

            <form onSubmit={handleReplyTicket} className="space-y-4">
              <textarea
                required
                rows={4}
                value={replyTicketModal.message}
                onChange={(e) => setReplyTicketModal({ ...replyTicketModal, message: e.target.value })}
                placeholder="Enter support resolution / agent response..."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 outline-hidden"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setReplyTicketModal({ open: false, ticket: null, message: '' })}
                  className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Send Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

