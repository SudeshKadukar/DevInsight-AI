import React from 'react';
import { motion } from 'framer-motion';

const STATUS_STYLE = {
  good: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30",
  ok: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
  risk: "text-rose-600 bg-rose-50 dark:bg-rose-900/30",
};

const MetricCard = ({ title, value, unit, deltaPct, status, icon: Icon, delay }) => {
  const isHigher = deltaPct > 0;
  const statusText = status === "good" ? "Good" : status === "ok" ? "Watch" : "Risk";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Icon size={20} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>}
        </div>
        <p className={`text-sm mt-2 font-medium flex items-center ${isHigher ? 'text-red-500' : 'text-emerald-500'}`}>
          {isHigher ? '↑' : '↓'} {Math.abs(deltaPct)}% from previous month
        </p>
        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLE[status]}`}>
          {statusText}
        </span>
      </div>
    </motion.div>
  );
};

export default MetricCard;
