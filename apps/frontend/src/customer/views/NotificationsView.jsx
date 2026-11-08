import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Truck, Tag, Shield, Clock } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await customerApi.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkSingle = async (id) => {
    try {
      await customerApi.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Truck className="w-4 h-4 text-emerald-700" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-orange-600" />;
      default:
        return <Shield className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-black text-stone-900">Notifications</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Stay informed with real-time delivery and order tracking updates
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-stone-200 p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <p className="text-3xl">🔔</p>
          <h3 className="text-lg font-bold text-stone-800">No New Notifications</h3>
          <p className="text-xs text-stone-500">You're completely up to date!</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 divide-y divide-stone-100 shadow-sm overflow-hidden">
          {notifications.map((n) => {
            const isRead = n.read || n.isRead;
            return (
              <div
                key={n._id}
                onClick={() => !isRead && handleMarkSingle(n._id)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition cursor-pointer ${
                  isRead ? 'bg-white hover:bg-stone-50/50' : 'bg-emerald-50/30 hover:bg-emerald-50/60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">{n.title}</h4>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-stone-600">{n.message}</p>
                    <p className="text-[10px] text-stone-400 pt-0.5">
                      {new Date(n.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
