import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export const Footer = ({ className = '' }) => {
  return (
    <footer className={`bg-[#EFEDE6] border-t border-[#DDDDDD] transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-[#DDDDDD] pb-8">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-8">
            <Link to="/scholarships" className="text-xs font-bold uppercase tracking-wider font-heading text-[#555555] hover:text-[#CD0000] transition-colors">
              Browse Scholarships
            </Link>
            <Link to="/recommendations" className="text-xs font-bold uppercase tracking-wider font-heading text-[#555555] hover:text-[#CD0000] transition-colors">
              AI Match Engine
            </Link>
            <Link to="/applications" className="text-xs font-bold uppercase tracking-wider font-heading text-[#555555] hover:text-[#CD0000] transition-colors">
              Applications
            </Link>
            <Link to="/settings" className="text-xs font-bold uppercase tracking-wider font-heading text-[#555555] hover:text-[#CD0000] transition-colors">
              Settings & Support
            </Link>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-[#666666] font-heading font-medium">
          <p>&copy; {new Date().getFullYear()} ScholarAI. All rights reserved. <span className="text-[#CD0000] font-bold">Discover. Qualify. Apply.</span></p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#111111] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#111111] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#111111] transition-colors">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
