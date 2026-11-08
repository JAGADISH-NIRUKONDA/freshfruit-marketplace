import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  CheckCircle2,
  Clock,
  Star,
  AlertCircle,
  Search,
  Send,
  User,
  ShieldCheck,
  Tag,
  ArrowRight,
  Filter,
} from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import OrderStatusBadge from '../components/dashboard/OrderStatusBadge';
import DataTable from '../components/dashboard/DataTable';
import { supportApi } from '../services/supportApi';

export default function SupportDashboard({ supportUser, onLogout, onExitToMarketplace }) {
  const [activeTab, setActiveTab] = useState('tickets');
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const data = await supportApi.getDashboard();
      setDashboardData(data);
      if (data?.tickets?.length > 0) {
        setSelectedTicket(data.tickets[0]);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const stats = dashboardData?.stats || {
    openTickets: 18,
    resolvedToday: 42,
    avgResponse: '4m 30s',
    satisfaction: '98.4%',
  };

  const navItems = [
    { id: 'tickets', label: 'Ticket Queue', icon: MessageSquare, badge: stats.openTickets },
    { id: 'resolved', label: 'Resolved Tickets', icon: CheckCircle2 },
    { id: 'analytics', label: 'Helpdesk SLA', icon: Clock },
    { id: 'profile', label: 'My Agent Profile', icon: User },
  ];

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'agent',
      text: replyMessage.trim(),
      time: 'Just now',
    };

    setSelectedTicket((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), newMsg],
    }));

    await supportApi.replyTicket(selectedTicket._id, replyMessage.trim());
    setReplyMessage('');
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    await supportApi.updateStatus(selectedTicket._id, newStatus);
  };

  const tickets = (dashboardData?.tickets || []).filter((t) =>
    filterCategory === 'all' ? true : t.category?.toLowerCase() === filterCategory.toLowerCase()
  );

  return (
    <DashboardLayout
      user={supportUser || { name: 'Priya', role: 'support_agent' }}
      role="support"
      roleTitle="Support Specialist"
      navItems={navItems}
      activeTab={activeTab}
      onNavigate={setActiveTab}
      onLogout={onLogout}
      onExitToMarketplace={onExitToMarketplace}
      title="Support Agent Dashboard"
      subtitle="Resolve customer inquiries, order disputes and farm feedback"
      searchPlaceholder="Search tickets by ID, customer name..."
      unreadNotifications={stats.openTickets}
    >
      <div className="space-y-6 text-left">
        {/* 1. TOP STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            icon={AlertCircle}
            label="Open Tickets"
            value={stats.openTickets}
            theme="orange"
            trend="18 pending"
          />
          <StatCard
            icon={CheckCircle2}
            label="Resolved Today"
            value={stats.resolvedToday}
            theme="green"
            trend="+14% vs avg"
          />
          <StatCard
            icon={Clock}
            label="Avg Response"
            value={stats.avgResponse}
            theme="blue"
            trend="< 5 mins target"
          />
          <StatCard
            icon={Star}
            label="CSAT Rating"
            value={stats.satisfaction}
            theme="yellow"
            trend="High quality"
          />
        </div>

        {/* 2. TICKET WORKSPACE: 2-COLUMN VIEW (QUEUE + ACTIVE CONVERSATION) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Ticket Registry (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-black text-stone-900 tracking-tight">
                Active Tickets
              </h3>
              <div className="flex items-center gap-1">
                {['all', 'delivery', 'refund'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket List scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {tickets.map((t) => {
                const isSelected = selectedTicket?._id === t._id;
                return (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs ring-1 ring-emerald-200'
                        : 'bg-stone-50/60 border-stone-200/70 hover:bg-stone-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-black text-stone-900">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-stone-800 truncate mb-1">
                      {t.subject}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                      <span>{t.customerName}</span>
                      <span>{t.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Ticket Conversation (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col h-[600px]">
            {selectedTicket ? (
              <>
                {/* Conversation Header */}
                <div className="pb-4 border-b border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-stone-900">
                        {selectedTicket.ticketNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        &bull; {selectedTicket.customerName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                      {selectedTicket.subject}
                    </h4>
                  </div>

                  {/* Status Switcher */}
                  <div className="flex items-center gap-1.5">
                    {['Open', 'In Progress', 'Resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                          selectedTicket.status === st
                            ? 'bg-[#16A34A] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 scrollbar-thin">
                  {(selectedTicket.messages || []).map((msg, idx) => {
                    const isAgent = msg.sender === 'agent';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${
                            isAgent
                              ? 'bg-[#064E2B] text-white rounded-br-xs'
                              : 'bg-stone-100 text-stone-800 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-stone-400 mt-1 px-1">
                          {isAgent ? 'You' : selectedTicket.customerName} &bull; {msg.time}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input Form */}
                <form
                  onSubmit={handleSendReply}
                  className="pt-3 border-t border-stone-100 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to customer..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-stone-100/90 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-full bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-stone-400 text-xs">
                <MessageSquare className="w-10 h-10 mb-2 text-stone-300" />
                <p>Select a ticket from the queue to start conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
