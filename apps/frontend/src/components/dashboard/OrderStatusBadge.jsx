import React from 'react';

const STATUS_CONFIGS = {
  delivered: {
    label: 'Delivered',
    bg: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-amber-100/90 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  shipped: {
    label: 'Shipped',
    bg: 'bg-sky-100/90 text-sky-800 border-sky-200',
    dot: 'bg-sky-500',
  },
  in_transit: {
    label: 'In Transit',
    bg: 'bg-sky-100/90 text-sky-800 border-sky-200',
    dot: 'bg-sky-500',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    bg: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-orange-100/90 text-orange-800 border-orange-200',
    dot: 'bg-orange-500',
  },
  assigned: {
    label: 'Assigned',
    bg: 'bg-indigo-100/90 text-indigo-800 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  canceled: {
    label: 'Canceled',
    bg: 'bg-rose-100/90 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
  },
  delayed: {
    label: 'Delayed',
    bg: 'bg-red-100/90 text-red-800 border-red-200',
    dot: 'bg-red-500',
  },
};

export default function OrderStatusBadge({ status, showDot = true }) {
  const normalized = String(status || '').toLowerCase().replace(/[\s-]/g, '_');
  const config = STATUS_CONFIGS[normalized] || {
    label: status || 'Unknown',
    bg: 'bg-stone-100 text-stone-700 border-stone-200',
    dot: 'bg-stone-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.bg}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      <span>{config.label}</span>
    </span>
  );
}
