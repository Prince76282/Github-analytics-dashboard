import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatExactNumber } from '@/lib/formatNumber';
import { Zap } from 'lucide-react';

interface SearchResultSummaryProps {
  query: string;
  totalCount: number;
  currentPage: number;
  perPage: number;
  cached?: boolean;
}

export const SearchResultSummary: React.FC<SearchResultSummaryProps> = ({
  query,
  totalCount,
  currentPage,
  perPage,
  cached,
}) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-typography-secondary">
      <div>
        Showing <span className="font-semibold text-typography-primary">{start}-{end}</span> of{' '}
        <span className="font-semibold text-typography-primary">{formatExactNumber(totalCount)}</span>{' '}
        repositories for <span className="font-bold text-typography-primary">"{query}"</span>
      </div>

      {cached && (
        <Badge variant="subtle" size="sm" className="gap-1 text-[11px]">
          <Zap className="w-3 h-3 text-status-warning fill-status-warning" />
          Cached
        </Badge>
      )}
    </div>
  );
};
