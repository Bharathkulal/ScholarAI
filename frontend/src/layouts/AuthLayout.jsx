import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from '../components/common/Logo';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-250">
      
      {/* Centered card wrapper */}
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8">
          <Logo link="/" />
        </div>
        
        <div className="w-full bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-premium">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
};
export default AuthLayout;
