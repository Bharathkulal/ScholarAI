import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import Footer from '../components/common/Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EFEDE6] text-[#111111] transition-colors duration-250">
      <PublicNavbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default PublicLayout;
