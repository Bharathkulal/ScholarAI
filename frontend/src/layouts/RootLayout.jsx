import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard, Search, FileText } from 'lucide-react';

const RootLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-dark-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-md border-b border-dark-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-dark-100 to-brand-400 bg-clip-text text-transparent">
              ScholarAI
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/scholarships" className="text-sm font-medium text-dark-300 hover:text-white transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Search
            </Link>
            {token ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-dark-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-semibold bg-dark-900 hover:bg-dark-800 text-rose-450 border border-dark-850 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Sticky Footer */}
      <footer className="border-t border-dark-800/80 bg-dark-950 py-6 text-center">
        <p className="text-xs text-dark-500">
          &copy; {new Date().getFullYear()} ScholarAI. All rights reserved. Discover. Qualify. Apply.
        </p>
      </footer>
    </div>
  );
};

export default RootLayout;
