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
    hover: hoverable ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {},
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${
        hoverable ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="p-6 md:p-8">
        {title && (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              {icon && <span className="text-2xl">{icon}</span>}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h3>
            </div>
            {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};
