import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const PublicNavbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-6">
          <NavLink
            to="/scholarships"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors duration-150 ${
                isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white'
              }`
            }
          >
            Explore Scholarships
          </NavLink>
          
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-850" />
          
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-605"
              >
                Go to Portal
              </Link>
              <button
                onClick={logout}
                className="btn-secondary !px-3 !py-1.5 !text-xs text-red-500"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-150"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default PublicNavbar;
