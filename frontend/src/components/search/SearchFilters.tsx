import React from 'react';
import { SearchResultSummary } from './SearchResultSummary';
import { SortSelector } from './SortSelector';

interface SearchFiltersProps {
  query: string;
  totalCount: number;
  currentPage: number;
  perPage?: number;
  cached?: boolean;
  sort: 'stars' | 'updated';
  onSortChange: (sort: 'stars' | 'updated') => void;
  isLoading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  query,
  totalCount,
  currentPage,
  perPage = 20,
  cached = false,
  sort,
  onSortChange,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-app-border pb-3">
      <SearchResultSummary
        query={query}
        totalCount={totalCount}
        currentPage={currentPage}
        perPage={perPage}
        cached={cached}
      />

      <SortSelector
        value={sort}
        onChange={onSortChange}
        disabled={isLoading}
      />
    </div>
  );
};
