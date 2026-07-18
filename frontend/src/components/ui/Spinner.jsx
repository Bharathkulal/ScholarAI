import React from 'react';

export const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizes = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-slate-200 border-t-slate-650',
    white: 'border-white/20 border-t-white',
  };

  const currentSize = sizes[size] || sizes.md;
  const currentColor = colors[color] || colors.primary;

  return (
    <div
      className={`rounded-full animate-spin ${currentSize} ${currentColor} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};
