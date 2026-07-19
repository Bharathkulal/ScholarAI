import React, { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  required = false,
  placeholder = 'Select an option',
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-[#111111] font-heading">
          {label} {required && <span className="text-[#CD0000]">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`w-full bg-white border ${
          error
            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]'
            : 'border-[#DDDDDD] focus:border-[#CD0000] focus:ring-[#CD0000]'
        } rounded-[16px] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:ring-1 transition-all duration-200 cursor-pointer`}
        {...props}
      >
        <option value="" disabled className="text-[#888888]">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-[#111111]">
            {opt.label}
          </option>
        ))}
      </select>
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

Select.displayName = 'Select';
