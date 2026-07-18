import React from 'react';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const currentSize = sizes[size] || sizes.md;

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 font-bold border border-slate-200 dark:border-slate-700 ${currentSize} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
