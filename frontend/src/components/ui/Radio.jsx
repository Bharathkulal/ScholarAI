import React, { forwardRef } from 'react';

export const Radio = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2.5">
        <input
          ref={ref}
          type="radio"
          id={id}
          className="w-4 h-4 rounded-full border-slate-350 dark:border-slate-700 text-primary-600 focus:ring-primary-500 cursor-pointer transition-colors duration-150"
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 pl-6">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';
