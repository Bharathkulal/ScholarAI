import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') return null;

  return (
    <nav className={`flex items-center gap-1.5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none ${className}`} aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150">
        <Home className="w-3.5 h-3.5" />
        Home
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.replace(/-/g, ' ');

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
            {isLast ? (
              <span className="text-slate-650 dark:text-slate-300 font-bold truncate">
                {formattedName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150 truncate"
              >
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
export default Breadcrumb;
