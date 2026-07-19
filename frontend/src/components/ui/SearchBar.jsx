import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search scholarships, providers, keywords...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-4 text-[#666666] pointer-events-none">
        <Search className="w-4.5 h-4.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#DDDDDD] rounded-[16px] pl-11 pr-10 py-3 text-sm text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#CD0000] focus:ring-1 focus:ring-[#CD0000] transition-all duration-200 shadow-sm"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 w-6 h-6 rounded-full hover:bg-[#EFEDE6] text-[#666666] hover:text-[#111111] flex items-center justify-center transition-colors duration-150"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
