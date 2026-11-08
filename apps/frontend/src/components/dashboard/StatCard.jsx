import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const THEME_STYLES = {
  green: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100 text-emerald-700',
    trendBg: 'bg-emerald-100/80 text-emerald-800',
  },
  blue: {
    bg: 'bg-sky-50/70',
    border: 'border-sky-100',
    iconBg: 'bg-sky-100 text-sky-700',
    trendBg: 'bg-sky-100/80 text-sky-800',
  },
  yellow: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100 text-amber-700',
    trendBg: 'bg-amber-100/80 text-amber-800',
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100 text-purple-700',
    trendBg: 'bg-purple-100/80 text-purple-800',
  },
  orange: {
    bg: 'bg-orange-50/70',
    border: 'border-orange-100',
    iconBg: 'bg-orange-100 text-orange-700',
    trendBg: 'bg-orange-100/80 text-orange-800',
  },
  white: {
    bg: 'bg-white',
    border: 'border-stone-200/80',
    iconBg: 'bg-emerald-50 text-emerald-700',
    trendBg: 'bg-emerald-100/80 text-emerald-800',
  },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendPositive = true,
  theme = 'white',
  subtitle,
  onClick,
}) {
  const styles = THEME_STYLES[theme] || THEME_STYLES.white;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`rounded-2xl p-4 sm:p-5 border ${styles.border} ${styles.bg} shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg} shadow-xs`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-stone-500 tracking-wide uppercase">
              {label}
            </p>
          </div>
        </div>

        {trend && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ${
              trendPositive
                ? styles.trendBg
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
        </div>
        {subtitle && (
          <span className="text-[11px] text-stone-400 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
}
