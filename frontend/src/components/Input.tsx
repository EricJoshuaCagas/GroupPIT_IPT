import React, { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  icon,
  required,
  ...props
}) => {
  const inputId =
    id || label?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-5"
    >
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-slate-dark">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg bg-white text-text-primary placeholder:text-text-secondary border-border focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-slate-50 disabled:text-text-secondary disabled:cursor-not-allowed transition-all duration-200 ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm font-medium text-red-600"
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-text-secondary">{helperText}</p>
      )}
    </motion.div>
  );
};
