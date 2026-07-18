import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  console.error("Route crash caught:", error);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-dark-900/40 border border-dark-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow vector overlay */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl" />
        
        <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
          <AlertOctagon className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-dark-100 mb-2">Unexpected Application Error</h1>
        <p className="text-dark-500 text-sm mb-6">
          We encountered an issue rendering this screen. Try refreshing or navigating home.
        </p>

        {error && (
          <div className="bg-dark-950/60 border border-dark-800/60 rounded-xl p-4 mb-8 text-left max-h-[140px] overflow-y-auto">
            <p className="text-xs font-mono text-rose-450 break-words">
              {error.statusText || error.message || String(error)}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(0)}
            className="px-5 py-3 bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-200 font-medium rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Page
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl shadow-lg shadow-brand-600/10 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
