import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'active' | 'completed' | 'overdue' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const getStatusConfig = () => {
    const configs = {
      active: {
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        icon: '🔵',
      },
      completed: {
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        icon: '✓',
      },
      overdue: {
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: '⚠️',
      },
      success: {
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        icon: '✓',
      },
      warning: {
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        icon: '⚠️',
      },
      danger: {
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        icon: '✕',
      },
    };
    return configs[status];
  };

  const config = getStatusConfig();

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border-2 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <span>{config.icon}</span>
      {children}
    </motion.span>
  );
};
