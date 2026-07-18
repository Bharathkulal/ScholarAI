import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Error403 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[70vh] max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-205 dark:border-red-900/30 text-red-500 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">403</h1>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
        Access Denied
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        You do not have administrative permission to view this section of ScholarAI.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="secondary">
          Go Back
        </Button>
        <Button onClick={() => navigate('/')} variant="primary">
          Back to Home
        </Button>
      </div>
    </div>
  );
};
export default Error403;
