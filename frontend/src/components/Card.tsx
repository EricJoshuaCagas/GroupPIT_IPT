import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  icon,
  hoverable = false,
}) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: hoverable ? { y: -3, boxShadow: '0 16px 30px rgba(15, 23, 42, 0.12)' } : {},
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      className={`bg-card rounded-2xl border border-border shadow-sm transition-all duration-300 overflow-hidden ${
        hoverable ? 'cursor-pointer hover:border-primary-200 hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="p-6 md:p-8">
        {title && (
          <div className="mb-6 border-b border-border pb-6">
            <div className="flex items-center gap-3 mb-2">
              {icon && <span className="text-2xl">{icon}</span>}
              <h3 className="text-xl md:text-2xl font-bold text-text-primary">{title}</h3>
            </div>
            {subtitle && <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};
