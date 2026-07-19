import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyle = "px-5 py-2.5 text-sm font-semibold rounded-[16px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CD0000] disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-[#CD0000] hover:bg-[#B30000] text-white shadow-[0_4px_14px_rgba(205,0,0,0.25)] border border-transparent",
    secondary: "bg-white hover:bg-[#EFEDE6] text-[#111111] border border-[#DDDDDD] shadow-sm",
    outline: "bg-transparent border-2 border-[#CD0000] hover:bg-[#FFE5E5] text-[#CD0000]",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    link: "bg-transparent text-[#CD0000] hover:underline focus:ring-0 p-0 shadow-none",
    ghost: "bg-transparent hover:bg-[#EFEDE6] text-[#111111]",
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: variant === 'primary' ? 1.02 : 1.01 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${currentVariant} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 text-current" />}
      {children}
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 text-current" />}
    </motion.button>
  );
};
