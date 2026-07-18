import React from 'react';
import { Hourglass } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const ComingSoon = ({
  featureName = 'This feature',
  description = 'Our developers are putting the final touches on this interface. Stay tuned!',
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[50vh] max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-500 flex items-center justify-center mb-6">
        <Hourglass className="w-8 h-8 animate-bounce" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
        {featureName} is Coming Soon!
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        {description}
      </p>
      <Button onClick={() => navigate(-1)} variant="secondary">
        Go Back
      </Button>
    </div>
  );
};
export default ComingSoon;
