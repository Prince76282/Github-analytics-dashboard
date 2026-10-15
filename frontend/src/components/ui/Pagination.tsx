import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
}) => {
  if (totalPages <= 1) return null;

  const isPrevDisabled = currentPage <= 1 || isLoading;
  const isNextDisabled = currentPage >= totalPages || isLoading;

  // Window of visible page numbers
  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn('flex items-center justify-between gap-3 pt-6 border-t border-app-border', className)}
    >
      <div className="text-xs text-typography-secondary">
        Page <span className="font-semibold text-typography-primary">{currentPage}</span> of{' '}
        <span className="font-semibold text-typography-primary">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={isPrevDisabled}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          aria-label="Previous Page"
        >
          Previous
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {startPage > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={isLoading}
                className="w-8 h-8 text-xs rounded border border-app-border hover:bg-app-elevated transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="px-1 text-xs text-typography-muted">…</span>}
            </>
          )}

          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange(p)}
                className={cn(
                  'w-8 h-8 text-xs font-medium rounded transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border border-app-border bg-app-surface text-typography-primary hover:bg-app-elevated'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-1 text-xs text-typography-muted">…</span>}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={isLoading}
                className="w-8 h-8 text-xs rounded border border-app-border hover:bg-app-elevated transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={isNextDisabled}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          aria-label="Next Page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
};
