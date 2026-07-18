import React from 'react';
import { motion } from 'framer-motion';

export const Toggle = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer ${
          checked ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm`}
          style={{ x: checked ? 20 : 0 }}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          onClick={() => !disabled && onChange(!checked)}
          className="text-sm font-medium text-slate-750 dark:text-slate-200 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
};
