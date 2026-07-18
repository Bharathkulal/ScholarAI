import React from 'react';

const Loading = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-dark-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center'
    : 'w-full h-full min-h-[200px] flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer glowing ring */}
        <div className={`rounded-full absolute inset-0 animate-ping opacity-25 bg-brand-500 ${size === 'sm' ? 'scale-125' : 'scale-150'}`} />
        
        {/* Spinner */}
        <div
          className={`${sizeClasses[size]} rounded-full border-brand-500/20 border-t-brand-500 animate-spin`}
          style={{ animationDuration: '0.8s' }}
        />
      </div>
      <p className="mt-4 text-sm font-medium text-dark-300 tracking-wider animate-pulse">
        ScholarAI Loading...
      </p>
    </div>
  );
};

export default Loading;
