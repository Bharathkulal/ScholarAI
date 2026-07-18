import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Shield, ListCollapse } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export const Header = ({ onMenuClick, className = '' }) => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (e) => {
    const role = e.target.value;
    switchRole(role || null);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'student') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Trigger + Logo */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-400"
              aria-label="Toggle menu"
            >
              <ListCollapse className="w-5 h-5" />
            </button>
          )}
          <Logo />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Quick Demo Role Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Demo Role:</span>
            <select
              value={user?.role || ''}
              onChange={handleRoleSelect}
              className="text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="">Guest (Public)</option>
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <ThemeToggle />

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-650 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors duration-150"
              >
                {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                {user.role === 'admin' ? 'Admin Portal' : 'Dashboard'}
              </Link>
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />
              
              <div className="flex items-center gap-2.5">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-90">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                  />
                  <span className="hidden lg:block text-sm font-semibold text-slate-750 dark:text-slate-200">
                    {user.full_name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 transition-colors duration-150">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
