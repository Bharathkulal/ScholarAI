import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) => {
  const Component = hoverable || onClick ? motion.div : 'div';

  return (
    <Component
      onClick={onClick}
      whileHover={hoverable ? { y: -3, boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.08)' } : {}}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white border border-[#DDDDDD] rounded-[24px] p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] transition-all ${
        onClick ? 'cursor-pointer hover:border-[#CD0000]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-5 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`text-sm text-[#444444] leading-relaxed ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-5 border-t border-[#EEEEEE] flex items-center justify-end gap-3 ${className}`}>{children}</div>
);
