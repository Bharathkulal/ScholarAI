import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';

export const PublicNavbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#EFEDE6] border-b border-[#DDDDDD] sticky top-0 z-40 backdrop-blur-md bg-opacity-95 transition-colors duration-200">
      <div className="app-container h-[80px] flex items-center justify-between">
        
        {/* Zone 1: Logo Left */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>
        
        {/* Zone 2: Navigation Center (Desktop/Laptop Only) */}
        <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-10">
          <NavLink
            to="/scholarships"
            className={({ isActive }) =>
              `text-xs font-bold tracking-wider uppercase font-heading transition-colors duration-150 min-h-[44px] flex items-center ${
                isActive ? 'text-[#CD0000]' : 'text-[#555555] hover:text-[#111111]'
              }`
            }
          >
            Explore Scholarships
          </NavLink>
          
          <a
            href="#ai-features"
            className="text-xs font-bold tracking-wider uppercase font-heading text-[#555555] hover:text-[#111111] transition-colors duration-150 min-h-[44px] flex items-center"
          >
            AI Match Engine
          </a>

          <a
            href="#how-it-works"
            className="text-xs font-bold tracking-wider uppercase font-heading text-[#555555] hover:text-[#111111] transition-colors duration-150 min-h-[44px] flex items-center"
          >
            How It Works
          </a>

          <a
            href="#faq"
            className="text-xs font-bold tracking-wider uppercase font-heading text-[#555555] hover:text-[#111111] transition-colors duration-150 min-h-[44px] flex items-center"
          >
            FAQ
          </a>
        </div>

        {/* Zone 3: Action Buttons Right */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="primary" className="!py-2.5 !px-5 text-xs font-heading uppercase tracking-wider min-h-[44px]">
                  Go to Portal
                </Button>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-bold font-heading uppercase text-[#DC2626] hover:underline min-h-[44px] px-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-wider font-heading text-[#111111] hover:text-[#CD0000] transition-colors duration-150 px-3 py-2 min-h-[44px] flex items-center"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="primary" className="!py-2.5 !px-6 text-xs font-heading uppercase tracking-wider min-h-[44px]">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#111111] hover:bg-[#E4E0D5] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#EFEDE6] border-b border-[#DDDDDD] px-5 py-6 space-y-4 font-heading uppercase text-xs font-bold">
          <Link
            to="/scholarships"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#111111] hover:text-[#CD0000]"
          >
            Explore Scholarships
          </Link>
          <a
            href="#ai-features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#555555] hover:text-[#111111]"
          >
            AI Match Engine
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#555555] hover:text-[#111111]"
          >
            How It Works
          </a>
          <div className="pt-4 border-t border-[#DDDDDD] flex flex-col gap-3">
            {isAuthenticated ? (
              <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full text-xs font-heading uppercase tracking-wider">
                  Go to Portal
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full text-xs font-heading uppercase tracking-wider">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full text-xs font-heading uppercase tracking-wider">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default PublicNavbar;
