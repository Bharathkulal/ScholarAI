import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import StudentSidebar from './StudentSidebar';
import AdminSidebar from './AdminSidebar';
import Logo from '../common/Logo';

export const MobileNavigation = ({ isOpen, onClose, role }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 shadow-premium"
          >
            {/* Header with logo & close */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 dark:border-slate-800">
              <Logo onItemClick={onClose} />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-400 hover:text-slate-655 flex items-center justify-center transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar content depending on role */}
            <div className="flex-1 overflow-y-auto">
              {role === 'admin' ? (
                <AdminSidebar onItemClick={onClose} className="!w-full border-r-0" />
              ) : (
                <StudentSidebar onItemClick={onClose} className="!w-full border-r-0" />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default MobileNavigation;
