import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOff, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-dark-900/40 border border-dark-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl" />
        
        <div className="mx-auto w-16 h-16 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-2xl flex items-center justify-center mb-6">
          <EyeOff className="w-8 h-8" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-brand-400 mb-2">404</h1>
        <h2 className="text-xl font-bold text-dark-100 mb-2">Page Not Found</h2>
        <p className="text-dark-500 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-dark-900 border border-dark-800 hover:bg-dark-800 text-dark-200 font-medium rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl shadow-lg shadow-brand-600/10 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
