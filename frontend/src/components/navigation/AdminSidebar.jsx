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
    <aside className={`w-[260px] bg-[#111111] text-white border-r border-[#222222] h-full flex flex-col pt-6 ${className}`}>
      
      {/* Admin Indicator */}
      <div className="px-6 mb-6">
        <div className="bg-[#CD0000] text-white rounded-[16px] px-3.5 py-2 text-center text-[10px] font-extrabold tracking-widest uppercase font-heading shadow-[0_4px_12px_rgba(205,0,0,0.3)]">
          System Control Console
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {ADMIN_SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider font-heading rounded-[16px] transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-[#CD0000] text-white shadow-[0_4px_14px_rgba(205,0,0,0.35)]'
                    : 'text-[#AAAAAA] hover:bg-[#222222] hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* Footer Info */}
      <div className="p-4 border-t border-[#222222] text-center text-[10px] text-[#666666] font-heading uppercase tracking-widest">
        ScholarAI Control Console v1.0.0
      </div>
    </aside>
  );
};
export default AdminSidebar;
