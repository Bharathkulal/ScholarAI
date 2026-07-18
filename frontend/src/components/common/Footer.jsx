import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export const Footer = ({ className = '' }) => {
  return (
    <footer className={`bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-6">
            <Link to="/scholarships" className="text-sm font-semibold text-slate-500 hover:text-primary-650 dark:text-slate-400 dark:hover:text-primary-400">
              Browse Scholarships
            </Link>
            <Link to="/recommendations" className="text-sm font-semibold text-slate-500 hover:text-primary-650 dark:text-slate-400 dark:hover:text-primary-400">
              AI Recommendations
            </Link>
            <Link to="/settings" className="text-sm font-semibold text-slate-500 hover:text-primary-650 dark:text-slate-400 dark:hover:text-primary-400">
              Support
            </Link>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} ScholarAI. All rights reserved. Discover. Qualify. Apply.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
