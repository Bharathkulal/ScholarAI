import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const baseStyle = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold select-none border tracking-wide font-heading";

  const variants = {
    primary: "bg-[#FFE5E5] text-[#CD0000] border-[#FFC9C9]",
    cherry: "bg-[#CD0000] text-white border-transparent",
    secondary: "bg-[#EFEDE6] text-[#111111] border-[#DDDDDD]",
    outline: "bg-white text-[#111111] border-[#DDDDDD]",
    success: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
    warning: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
    danger: "bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]",
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <span className={`${baseStyle} ${currentVariant} ${className}`}>
      {children}
    </span>
  );
};
