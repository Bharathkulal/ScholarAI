import React, { useState } from 'react';
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
  UserCheck,
  ChevronLeft,
  ChevronRight
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-[#111111] text-white border-r border-[#222222] h-full flex flex-col pt-6 transition-all duration-300 relative ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      } ${className}`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#CD0000] text-white flex items-center justify-center shadow-lg border border-[#111111] cursor-pointer hover:bg-[#B30000] transition-colors z-30"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Sidebar Logo Header */}
      <div className={`mb-6 transition-all duration-200 ${isCollapsed ? 'px-3 text-center' : 'px-6'}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-xl bg-[#CD0000] flex items-center justify-center text-white font-extrabold mx-auto shadow-[0_4px_12px_rgba(205,0,0,0.3)]">
            S
          </div>
        ) : (
          <div>
            <Logo isDark={true} link="/dashboard" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-heading text-[#888888] block mt-3">
              Student Portal
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3.5 ${
                  isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3.5'
                } text-xs font-bold uppercase tracking-wider font-heading rounded-[16px] transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-[#CD0000] text-white shadow-[0_4px_14px_rgba(205,0,0,0.35)]'
                    : 'text-[#AAAAAA] hover:bg-[#222222] hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Footer Info */}
      <div className={`p-4 border-t border-[#222222] text-center text-[10px] text-[#666666] font-heading uppercase tracking-widest ${isCollapsed ? 'px-2' : ''}`}>
        {isCollapsed ? 'v1.0' : 'ScholarAI Portal v1.0.0'}
      </div>
    </aside>
  );
};
export default StudentSidebar;
