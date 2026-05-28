import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'active' | 'completed' | 'overdue' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const configs = {
    active: {
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700',
      borderColor: 'border-primary-200',
      dotColor: 'bg-primary-500',
    },
    completed: {
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700',
      borderColor: 'border-primary-200',
      dotColor: 'bg-primary-500',
    },
    overdue: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      dotColor: 'bg-red-500',
    },
    success: {
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700',
      borderColor: 'border-primary-200',
      dotColor: 'bg-primary-500',
    },
    warning: {
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-dark',
      borderColor: 'border-slate-200',
      dotColor: 'bg-slate-500',
    },
    danger: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      dotColor: 'bg-red-500',
    },
  };

  const config = configs[status];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
      {children}
    </motion.span>
  );
};
