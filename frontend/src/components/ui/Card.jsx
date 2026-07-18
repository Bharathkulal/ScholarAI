import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const Component = hoverable || onClick ? motion.div : 'div';

  return (
    <Component
      onClick={onClick}
      whileHover={hoverable && !onClick ? { y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' } : {}}
      className={`bg-white dark:bg-slate-800 border border-slate-250/70 dark:border-slate-700/60 rounded-2xl p-6 shadow-soft transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-primary-400 dark:hover:border-primary-600' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`text-sm text-slate-650 dark:text-slate-300 leading-relaxed ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-750 flex items-center justify-end gap-3 ${className}`}>{children}</div>
);
