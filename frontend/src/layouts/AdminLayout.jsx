import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import AdminSidebar from '../components/navigation/AdminSidebar';
import MobileNavigation from '../components/navigation/MobileNavigation';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Footer from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Top Header */}
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} className="border-red-100 dark:border-red-950/20" />

      {/* Main Container Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Desktop Sidebar */}
        <AdminSidebar className="hidden lg:flex flex-shrink-0" />

        {/* Right Content Area */}
        <div className="flex-grow flex flex-col min-w-0">
          <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb />
            <div className="mt-2">
              <Outlet />
            </div>
          </main>
          
          <Footer className="border-t-0" />
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        role={user?.role}
      />
    </div>
  );
};
export default AdminLayout;
