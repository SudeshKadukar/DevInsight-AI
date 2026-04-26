import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const InsightBox = ({ insight, index }) => {
  const isTypeWarning = insight.type === 'warning';
  const isTypeDanger = insight.type === 'danger';
  const isTypeSuccess = insight.type === 'success';

  let bgColor = 'bg-blue-50 dark:bg-blue-900/20';
  let borderColor = 'border-blue-200 dark:border-blue-800';
  let iconColor = 'text-blue-500';
  let Icon = Info;

  if (isTypeWarning) {
    bgColor = 'bg-amber-50 dark:bg-amber-900/20';
    borderColor = 'border-amber-200 dark:border-amber-800';
    iconColor = 'text-amber-500';
    Icon = AlertCircle;
  } else if (isTypeDanger) {
    bgColor = 'bg-red-50 dark:bg-red-900/20';
    borderColor = 'border-red-200 dark:border-red-800';
    iconColor = 'text-red-500';
    Icon = AlertCircle;
  } else if (isTypeSuccess) {
    bgColor = 'bg-emerald-50 dark:bg-emerald-900/20';
    borderColor = 'border-emerald-200 dark:border-emerald-800';
    iconColor = 'text-emerald-500';
    Icon = CheckCircle2;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`p-4 rounded-lg border ${bgColor} ${borderColor} mb-3 flex items-start gap-3`}
    >
      <Icon className={`mt-0.5 shrink-0 ${iconColor}`} size={20} />
      <div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{insight.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{insight.description}</p>
      </div>
    </motion.div>
  );
};

export default InsightBox;
