import React from 'react';
import { AlertCircle, CheckCircle, Info, TriangleAlert, X } from 'lucide-react';

export const Alert = ({
  children,
  title,
  variant = 'info',
  onClose,
  className = '',
}) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: TriangleAlert,
    danger: AlertCircle,
  };

  const Icon = icons[variant] || icons.info;

  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900/30',
    success: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30',
    warning: 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
    danger: 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900/30',
  };

  const currentStyle = styles[variant] || styles.info;

  return (
    <div className={`p-4 border rounded-xl flex gap-3 relative ${currentStyle} ${className}`} role="alert">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-current" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <h5 className="font-bold text-sm leading-tight text-current">{title}</h5>}
        <div className="text-sm leading-normal opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 w-6 h-6 rounded-md hover:bg-slate-900/5 dark:hover:bg-white/5 flex items-center justify-center text-current opacity-70 hover:opacity-100 transition-opacity duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
