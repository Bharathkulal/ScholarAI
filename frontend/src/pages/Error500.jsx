import React from 'react';
import { ServerCrash } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[70vh] max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mb-6">
        <ServerCrash className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">500</h1>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
        Internal Server Error
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        ScholarAI is experiencing connection drops. Our engineers are investigating. Please try again shortly.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="primary">
          Refresh Page
        </Button>
        <Button onClick={() => navigate('/')} variant="secondary">
          Go Home
        </Button>
      </div>
    </div>
  );
};
export default Error500;
