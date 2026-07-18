import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  showValue = false,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`bg-primary-600 rounded-full transition-all duration-300 ${currentSize}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={max}
        />
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-end">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
