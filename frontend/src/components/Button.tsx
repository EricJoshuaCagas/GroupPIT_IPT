import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  children,
  icon,
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 shadow-sm hover:shadow-md focus:ring-primary-300',
    secondary: 'bg-white text-slate-dark border border-slate-dark hover:bg-slate-50 hover:text-slate-900 focus:ring-primary-200',
    danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700 shadow-sm hover:shadow-md focus:ring-red-300',
    ghost: 'text-slate-dark hover:bg-primary-50 hover:text-primary-600 focus:ring-primary-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      as="button"
      whileHover={{ scale: disabled ? 1 : 1.01 } as any}
      whileTap={{ scale: disabled ? 1 : 0.98 } as any}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {icon && <span>{icon}</span>}
      {loading ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
