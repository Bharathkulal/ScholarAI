import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-750/70 ${className}`}>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          className="!p-2 min-h-0"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          const isCurrent = page === currentPage;
          return (
            <Button
              key={page}
              variant={isCurrent ? 'primary' : 'secondary'}
              className="!px-3 !py-1 min-h-0 text-xs"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}
        <Button
          variant="secondary"
          className="!p-2 min-h-0"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
