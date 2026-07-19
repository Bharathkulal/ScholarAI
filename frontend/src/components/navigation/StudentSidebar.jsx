import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
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
    <aside className={`w-[260px] bg-[#111111] text-white border-r border-[#222222] h-full flex flex-col pt-6 ${className}`}>
      
      {/* Sidebar Label Header */}
      <div className="px-6 mb-6">
        <Logo isDark={true} link="/dashboard" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest font-heading text-[#888888] block mt-3">
          Student Portal
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
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
        ScholarAI Portal v1.0.0
      </div>
    </aside>
  );
};
export default StudentSidebar;
