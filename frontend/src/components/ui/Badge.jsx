import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border";

  const variants = {
    primary: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/30",
    secondary: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    success: "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    warning: "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    danger: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30",
  };

  const currentVariant = variants[variant] || variants.primary;

  return (
    <span className={`${baseStyle} ${currentVariant} ${className}`}>
      {children}
    </span>
  );
};
