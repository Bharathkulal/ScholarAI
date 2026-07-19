import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Shield, ListCollapse } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from './Logo';

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
    <header className={`sticky top-0 z-40 w-full bg-[#EFEDE6] border-b border-[#DDDDDD] transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Mobile Menu Trigger + Logo */}
        <div className="flex items-center gap-3">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Quick Demo Role Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-bold font-heading uppercase text-[#666666] tracking-wider">Role Switcher:</span>
            <select
              value={user?.role || ''}
              onChange={handleRoleSelect}
              className="text-xs font-bold font-heading uppercase bg-white border border-[#DDDDDD] text-[#111111] rounded-[12px] px-3 py-1.5 focus:outline-none focus:border-[#CD0000] cursor-pointer shadow-sm"
            >
              <option value="">Guest (Public)</option>
              <option value="student">Student Portal</option>
              <option value="admin">Admin Console</option>
            </select>
          </div>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-heading text-[#111111] hover:text-[#CD0000] transition-colors duration-150"
              >
                {user.role === 'admin' ? <Shield className="w-4 h-4 text-[#CD0000]" /> : <LayoutDashboard className="w-4 h-4 text-[#CD0000]" />}
                {user.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
              </Link>
              <div className="h-6 w-[1px] bg-[#DDDDDD] hidden md:block" />
              
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-90">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] object-cover"
                  />
                  <span className="hidden lg:block text-xs font-bold uppercase tracking-wider font-heading text-[#111111]">
                    {user.full_name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-[#DC2626] hover:bg-[#FFE5E5] transition-all duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-bold uppercase tracking-wider font-heading text-[#111111] hover:text-[#CD0000] transition-colors duration-150 px-2 py-1">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-xs font-heading uppercase tracking-wider">
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
