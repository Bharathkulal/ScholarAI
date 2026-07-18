import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const Logo = ({ className = '', link = '/' }) => {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
        <GraduationCap className="w-6 h-6" />
      </div>
      <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
        ScholarAI
      </span>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="hover:opacity-95 transition-opacity duration-150">
        {content}
      </Link>
    );
  }

  return content;
};
export default Logo;
