import React from 'react';
import { Database } from 'lucide-react';

export const NoData = ({
  title = 'No data available',
  description = 'There are no active records in this catalog yet.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[30vh]">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
        <Database className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-205 mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
        {description}
      </p>
    </div>
  );
};
export default NoData;
