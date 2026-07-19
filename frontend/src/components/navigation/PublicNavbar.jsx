import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const PublicNavbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="w-full bg-[#EFEDE6] border-b border-[#DDDDDD] sticky top-0 z-40 backdrop-blur-md bg-opacity-90 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-6 sm:gap-8">
          <NavLink
            to="/scholarships"
            className={({ isActive }) =>
              `text-xs sm:text-sm font-bold tracking-wider uppercase font-heading transition-colors duration-150 ${
                isActive ? 'text-[#CD0000]' : 'text-[#555555] hover:text-[#111111]'
              }`
            }
          >
            Explore Scholarships
          </NavLink>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="primary" className="!py-2 !px-4 text-xs font-heading uppercase tracking-wider">
                  Go to Portal
                </Button>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-bold font-heading uppercase text-[#DC2626] hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-wider font-heading text-[#111111] hover:text-[#CD0000] transition-colors duration-150 px-2 py-1"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="primary" className="!py-2 !px-5 text-xs font-heading uppercase tracking-wider">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default PublicNavbar;
