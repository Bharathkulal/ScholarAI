import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  id,
  required = false,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          className={`w-full bg-white dark:bg-slate-800 border ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500'
          } rounded-xl ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500">
          {error.message || error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
