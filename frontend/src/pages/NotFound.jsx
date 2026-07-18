import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOff, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none max-w-md mx-auto">
      <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6">
        <EyeOff className="w-8 h-8" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        
        <Button
          onClick={() => navigate('/')}
          variant="primary"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
