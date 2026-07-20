import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Shield, ListCollapse, Search, Bell, Sparkles, Command } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from './Logo';

export const Header = ({ onMenuClick, onAiAssistantClick, className = '' }) => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/scholarships?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full bg-[#EFEDE6] border-b border-[#DDDDDD] transition-colors duration-200 ${className}`}>
      <div className="app-container h-20 flex items-center justify-between gap-4">
        
        {/* Left Zone: Mobile Menu Trigger + Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl hover:bg-[#E4E0D5] text-[#111111]"
              aria-label="Toggle menu"
            >
              <ListCollapse className="w-5 h-5" />
            </button>
          )}
          <Logo />
        </div>

        {/* Center Zone: Quick Search Input (Desktop & Laptop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scholarships, programs, documents... (⌘K)"
              className="w-full bg-white border border-[#DDDDDD] rounded-[16px] pl-10 pr-12 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#CD0000] focus:ring-2 focus:ring-[#CD0000]/10 shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold font-heading uppercase text-[#888888] bg-[#EFEDE6] px-1.5 py-0.5 rounded border border-[#DDDDDD]">
              ⌘K
            </span>
          </form>
        </div>

        {/* Right Zone: AI Assistant + Notifications + Role Switcher + User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* AI Assistant Button */}
          <button
            onClick={onAiAssistantClick}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-[16px] bg-[#FFE5E5] border border-[#FFC9C9] text-[#CD0000] text-xs font-bold font-heading uppercase tracking-wider hover:bg-[#FFD6D6] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>

          {/* Notifications Bell with Badge */}
          <Link
            to="/notifications"
            className="relative p-2.5 rounded-[16px] bg-white border border-[#DDDDDD] text-[#111111] hover:bg-[#EFEDE6] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#CD0000] text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white">
              3
            </span>
          </Link>

          {/* User Role Badge */}
          {user && (
            <div className="hidden lg:flex items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest font-heading px-2.5 py-1 rounded-[12px] bg-[#EFEDE6] border border-[#DDDDDD] text-[#111111]">
                {user.role === 'super_admin' || user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Student'}
              </span>
            </div>
          )}

          {/* User Profile Info */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2.5 hover:opacity-90 bg-white border border-[#DDDDDD] p-1.5 pr-3.5 rounded-[16px] shadow-sm">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
                  alt={user.full_name}
                  className="w-7 h-7 rounded-full border border-[#DDDDDD] object-cover shrink-0"
                />
                <span className="hidden xl:block text-xs font-extrabold uppercase tracking-wider font-heading text-[#111111]">
                  {user.full_name.split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-[16px] text-[#DC2626] bg-white border border-[#DDDDDD] hover:bg-[#FFE5E5] transition-all duration-200 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-bold uppercase tracking-wider font-heading text-[#111111] hover:text-[#CD0000] transition-colors px-2 py-1">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-xs font-heading uppercase tracking-wider min-h-[44px]">
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
