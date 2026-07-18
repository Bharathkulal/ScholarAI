import React from 'react';
import Spinner from '../ui/Spinner';

export const LoadingPage = ({ message = 'Loading, please wait...' }) => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 text-center">
      <Spinner size="lg" color="primary" />
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );
};
export default LoadingPage;
