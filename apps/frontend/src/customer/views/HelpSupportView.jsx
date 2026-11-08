import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Plus,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function HelpSupportView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('order');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const faqs = [
    {
      q: 'How does FreshFruit Market ensure fresh produce quality?',
      a: 'We harvest directly after your order is confirmed. Produce is sorted, packed at source inside eco-insulated cold-chain boxes, and transported within 24–48 hours to minimize transit time.',
    },
    {
      q: 'What is your refund and return policy for perishable fruits?',
      a: 'If any produce arrives damaged or unsatisfactory, simply snap a quick photo and create a support ticket or request refund within 24 hours of delivery. We offer an unconditional replacement or full refund.',
    },
    {
      q: 'Can I track the exact courier delivery route?',
      a: 'Yes, your Customer Dashboard provides a real-time 4-stage tracking timeline (Order Placed, Packed, Out for Delivery, Delivered) with estimated arrival windows.',
    },
    {
      q: 'Are all fruits and vegetables organic and chemical-free?',
      a: 'Our registered farmers follow natural and regenerative agricultural practices. Products with the "100% Organic" green badge are independently tested and certified pesticide-free.',
    },
  ];

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getTickets();
      setTickets(data || []);
    } catch (err) {
      console.error('Failed to load support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await customerApi.createTicket({
        subject,
        category,
        description,
      });
      setIsModalOpen(false);
      setSubject('');
      setDescription('');
      await fetchTickets();
    } catch (err) {
      alert(err.message || 'Failed to create support ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      await customerApi.addTicketMessage(selectedTicket._id, replyMessage.trim());
      setReplyMessage('');
      await fetchTickets();
      const updated = tickets.find((t) => t._id === selectedTicket._id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-black text-stone-900">Help & Support Center</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            We're here 24/7 to help with deliveries, orders, and farmer questions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FAQs (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-stone-900">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-stone-200/80 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 bg-[#f8faf8] hover:bg-[#f0fdf4] transition cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-stone-900">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 transition-transform ${
                          isOpen ? 'rotate-180 text-emerald-700' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Existing Tickets (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900">Your Support Tickets</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-stone-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-3xl">💬</p>
                <p className="text-xs font-bold text-stone-700">No Open Tickets</p>
                <p className="text-[11px] text-stone-400">All queries have been answered.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className="p-3.5 rounded-2xl border border-stone-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition cursor-pointer space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-700">#{t.ticketNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="font-bold text-stone-900 truncate">{t.subject}</p>
                    <p className="text-[10px] text-stone-400">
                      {new Date(t.createdAt).toLocaleDateString()} • {t.messages?.length || 1} messages
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-stone-900">Create Support Ticket</h3>
              <p className="text-xs text-stone-500">We respond to tickets within 2 business hours.</p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600"
                >
                  <option value="order">Order & Tracking</option>
                  <option value="delivery">Delivery Partner / Address</option>
                  <option value="product">Produce Freshness & Quality</option>
                  <option value="payment">Refund / Payment Issue</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of your inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Description & Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe what happened, including any order or product details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#0a3d24] text-white font-bold hover:bg-[#072c1a] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAIL / MESSAGE THREAD MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs font-bold text-emerald-800">
                Ticket #{selectedTicket.ticketNumber}
              </span>
              <h3 className="text-base font-black text-stone-900">{selectedTicket.subject}</h3>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {selectedTicket.messages?.map((msg, idx) => {
                const isCust = msg.senderRole === 'customer';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl max-w-[85%] ${
                      isCust
                        ? 'bg-emerald-50 ml-auto border border-emerald-100 text-stone-800'
                        : 'bg-stone-100 mr-auto text-stone-800'
                    }`}
                  >
                    <p className="font-bold text-[10px] text-stone-400 mb-1">
                      {isCust ? 'You' : 'FreshFruit Support Agent'}
                    </p>
                    <p>{msg.message}</p>
                    <p className="text-[9px] text-stone-400 text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-stone-100">
              <input
                type="text"
                placeholder="Type your message..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
