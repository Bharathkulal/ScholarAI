import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-[#DDDDDD] flex gap-6 sm:gap-8 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`py-3 text-sm font-bold font-heading relative transition-colors duration-200 focus:outline-none cursor-pointer ${
              isActive
                ? 'text-[#CD0000]'
                : 'text-[#555555] hover:text-[#111111]'
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CD0000] rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
