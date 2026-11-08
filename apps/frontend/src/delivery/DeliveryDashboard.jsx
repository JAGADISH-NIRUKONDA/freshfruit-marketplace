import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  IndianRupee,
  Calendar,
  User,
  Headphones,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Package,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import OrderStatusBadge from '../components/dashboard/OrderStatusBadge';
import DataTable from '../components/dashboard/DataTable';
import { deliveryApi } from '../services/deliveryApi';

export default function DeliveryDashboard({ deliveryUser, onLogout, onExitToMarketplace }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [currentDeliveryStatus, setCurrentDeliveryStatus] = useState('in_transit');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const data = await deliveryApi.getDashboard();
      setDashboardData(data);
      if (data?.currentDelivery?.status) {
        setCurrentDeliveryStatus(data.currentDelivery.status);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const stats = dashboardData?.stats || {
    todayDeliveries: 12,
    completed: 9,
    pending: 3,
    earnings: 1860,
  };

  const currentDel = dashboardData?.currentDelivery || {
    orderNumber: '#FF7890',
    deliveryAddress: 'Flat 402, Green Meadows, Brodipet, Guntur',
    eta: '18 mins',
    amount: 540,
    customerName: 'Kavitha Reddy',
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deliveries', label: 'My Deliveries', icon: Truck, badge: stats.pending },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  const handleUpdateCurrentStatus = async (newStatus) => {
    setCurrentDeliveryStatus(newStatus);
    await deliveryApi.updateStatus('del-1', newStatus);
  };

  return (
    <DashboardLayout
      user={deliveryUser || { name: 'Suresh', role: 'delivery_partner' }}
      role="delivery"
      roleTitle="Delivery Partner"
      navItems={navItems}
      activeTab={activeTab}
      onNavigate={setActiveTab}
      onLogout={onLogout}
      onExitToMarketplace={onExitToMarketplace}
      title="Delivery Dashboard"
      subtitle="Track deliveries and earn more"
      searchPlaceholder="Search delivery orders, addresses..."
      unreadNotifications={2}
    >
      <div className="space-y-6 text-left">
        {/* 1. TOP KPI CARDS matching collage exactly */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            icon={Package}
            label="Today's Deliveries"
            value={stats.todayDeliveries}
            theme="blue"
            trend="+2 today"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completed}
            theme="green"
            trend="9 completed"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pending}
            theme="orange"
            trend="3 active"
          />
          <StatCard
            icon={IndianRupee}
            label="Earnings"
            value={stats.earnings}
            prefix="₹"
            theme="yellow"
            trend="₹1,860 today"
          />
        </div>

        {/* 2. CURRENT ACTIVE DELIVERY WITH MAP MOCKUP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 tracking-tight">
                    Current Delivery
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Order {currentDel.orderNumber} &bull; Express Dispatch
                  </p>
                </div>
              </div>
              <OrderStatusBadge status={currentDeliveryStatus} />
            </div>

            {/* Interactive Map Visual Panel */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-br from-stone-100 via-emerald-50/40 to-stone-200/50 border border-stone-200 overflow-hidden mb-4 flex items-center justify-center">
              {/* Simulated Map Grid Roads */}
              <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#roadGrid)" />
                {/* Simulated Delivery Path */}
                <path
                  d="M 60 180 Q 180 80 320 120 T 560 60"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="4"
                  strokeDasharray="6,6"
                  className="animate-pulse"
                />
              </svg>

              {/* Pickup Pin */}
              <div className="absolute left-14 bottom-10 z-10 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-bold shadow-md mb-1">
                  Sharma Orchards
                </div>
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Delivery Destination Pin */}
              <div className="absolute right-16 top-10 z-10 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-[#16A34A] text-white text-[10px] font-bold shadow-md mb-1">
                  Drop: Guntur
                </div>
                <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-200 animate-bounce">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Scooter Rider Mockup on Path */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 px-3 py-1.5 rounded-full border border-emerald-300 shadow-md flex items-center gap-2">
                <span className="text-base animate-pulse">🛵</span>
                <span className="text-[11px] font-extrabold text-emerald-800">
                  ETA: {currentDel.eta}
                </span>
              </div>
            </div>

            {/* Delivery Meta Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase">Customer</p>
                <p className="font-bold text-stone-900">{currentDel.customerName}</p>
                <p className="text-[11px] text-stone-500">{currentDel.customerPhone || '+91 98480 22334'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase">Delivery Address</p>
                <p className="font-medium text-stone-800 truncate">{currentDel.deliveryAddress}</p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <p className="text-[10px] font-bold text-stone-400 uppercase">Cash to Collect</p>
                <p className="text-sm font-black text-emerald-700">₹{currentDel.amount}</p>
              </div>
            </div>

            {/* Quick Action Status Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentDel.deliveryAddress)}`, '_blank')}
                className="px-5 py-2.5 rounded-full bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateCurrentStatus('picked_up')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    currentDeliveryStatus === 'picked_up'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Picked Up
                </button>
                <button
                  onClick={() => handleUpdateCurrentStatus('in_transit')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    currentDeliveryStatus === 'in_transit'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Out for Delivery
                </button>
                <button
                  onClick={() => handleUpdateCurrentStatus('delivered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    currentDeliveryStatus === 'delivered'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Mark Delivered &check;
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Earnings Summary & Scooter Artwork */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-black text-stone-900 tracking-tight">
                  Today's Earnings
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Instant Payout
                </span>
              </div>
              <p className="text-3xl font-black text-stone-900 leading-tight">
                ₹{stats.earnings}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                9 orders completed &bull; Avg ₹206/delivery
              </p>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Base Delivery Pay</span>
                  <span className="font-bold text-stone-900">₹1,350</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Peak Express Bonus</span>
                  <span className="font-bold text-emerald-600">+₹320</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Customer Tips</span>
                  <span className="font-bold text-emerald-600">+₹190</span>
                </div>
              </div>
            </div>

            {/* Delivery Partner Scooter Mascot Illustration Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#064E2B] to-[#04331C] p-6 text-white text-center shadow-md relative overflow-hidden flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mb-3 shadow-inner">
                🛵
              </div>
              <h4 className="font-extrabold text-base text-white">
                Safe &amp; Fresh Riding
              </h4>
              <p className="text-xs text-emerald-200/80 mt-1 max-w-xs">
                Maintain 4.9+ delivery satisfaction to unlock weekly fuel and milestone bonuses!
              </p>
            </div>
          </div>
        </div>

        {/* 3. TODAY'S DELIVERIES QUEUE */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-stone-900 tracking-tight">
                Today's Delivery Manifest
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Live queue of assigned marketplace drop locations
              </p>
            </div>
          </div>

          <DataTable
            columns={[
              {
                key: 'orderNumber',
                label: 'Order #',
                render: (row) => <span className="font-bold text-stone-900">#{row.orderNumber}</span>,
              },
              {
                key: 'customerName',
                label: 'Customer',
                render: (row) => (
                  <div>
                    <p className="font-bold text-stone-900">{row.customerName}</p>
                    <p className="text-[10px] text-stone-400">{row.deliveryAddress}</p>
                  </div>
                ),
              },
              {
                key: 'time',
                label: 'Time Slot',
                render: (row) => <span className="text-xs text-stone-600">{row.time || 'Today'}</span>,
              },
              {
                key: 'amount',
                label: 'Order Value',
                render: (row) => <span className="font-extrabold text-emerald-800">₹{row.amount}</span>,
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => <OrderStatusBadge status={row.status} />,
              },
            ]}
            data={dashboardData?.deliveries || []}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
