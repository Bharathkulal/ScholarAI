import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const Logo = ({ className = '', link = '/', isDark = false, textColor }) => {
  const textClass = textColor || (isDark ? 'text-white' : 'text-[#111111]');

  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-[#CD0000] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(205,0,0,0.25)] shrink-0">
        <GraduationCap className="w-5 h-5" />
      </div>
      <span className={`text-xl font-extrabold tracking-tight font-heading ${textClass}`}>
        ScholarAI<span className="text-[#CD0000]">.</span>
      </span>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="hover:opacity-95 transition-opacity duration-150">
        {content}
      </Link>
    );
  }

  return content;
};
export default Logo;
