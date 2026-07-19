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
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-[#111111] font-heading">
          {label} {required && <span className="text-[#CD0000]">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#666666] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          className={`w-full bg-white border ${
            error
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
              : 'border-[#DDDDDD] focus:border-[#CD0000] focus:ring-[#CD0000]'
          } rounded-[16px] ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 text-sm text-[#111111] placeholder-[#888888] focus:outline-none focus:ring-1 transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-[#DC2626]">
          {error.message || error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-[#666666]">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
