import React from 'react';

export const SectionHeader = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};
export default SectionHeader;
