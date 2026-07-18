import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Search,
  UserSquare,
  FileCheck,
  Megaphone,
  BarChart3,
  Settings
} from 'lucide-react';

const ADMIN_SIDEBAR_ITEMS = [
  { label: 'Admin Dashboard', path: '/admin', icon: Shield },
  { label: 'Manage Scholarships', path: '/scholarships', icon: Search },
  { label: 'Verification Queue', path: '/applications', icon: FileCheck },
  { label: 'User Directory', path: '/profile', icon: UserSquare },
  { label: 'Announcements', path: '/notifications', icon: Megaphone },
  { label: 'Analytics Reports', path: '/dashboard', icon: BarChart3 },
  { label: 'Global Settings', path: '/settings', icon: Settings },
];

export const AdminSidebar = ({ className = '', onItemClick }) => {
  return (
    <aside className={`w-[260px] bg-white dark:bg-slate-900 border-r border-slate-205 dark:border-slate-800 h-full flex flex-col pt-6 transition-colors duration-200 ${className}`}>
      
      {/* Admin Indicator */}
      <div className="px-6 mb-6">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl px-3 py-2 text-center text-xs font-bold text-red-600 dark:text-red-400 select-none">
          SYSTEM ADMINISTRATOR
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {ADMIN_SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-950/25 text-red-655 dark:text-red-400'
                    : 'text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400">
        ScholarAI Control Console v1.0.0
      </div>
    </aside>
  );
};
export default AdminSidebar;
