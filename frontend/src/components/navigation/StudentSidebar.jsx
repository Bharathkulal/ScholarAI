import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Cpu,
  FileText,
  FolderOpen,
  Bell,
  Settings,
  UserCheck
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Scholarships', path: '/scholarships', icon: Search },
  { label: 'AI Matches', path: '/recommendations', icon: Cpu },
  { label: 'My Applications', path: '/applications', icon: FileText },
  { label: 'Document Vault', path: '/documents', icon: FolderOpen },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Profile Settings', path: '/profile', icon: UserCheck },
  { label: 'System Settings', path: '/settings', icon: Settings },
];

export const StudentSidebar = ({ className = '', onItemClick }) => {
  return (
    <aside className={`w-[260px] bg-white dark:bg-slate-900 border-r border-slate-205 dark:border-slate-800 h-full flex flex-col pt-6 transition-colors duration-200 ${className}`}>
      
      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
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
        ScholarAI Student Portal v1.0.0
      </div>
    </aside>
  );
};
export default StudentSidebar;
