import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { RepositoryList } from '@/components/repositories/RepositoryList';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Repository } from '@/types/repository';

interface SearchResultsProps {
  query: string;
  items: Repository[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onClearSearch: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  items,
  totalPages,
  currentPage,
  isLoading,
  isFetching,
  onPageChange,
  onClearSearch,
}) => {
  if (isLoading) {
    return <RepositoryList repositories={[]} isLoading={true} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={SearchIcon}
        title={`No repositories found matching "${query}"`}
        description="Try searching for a different keyword or checking for typos."
        actionLabel="Clear Search"
        onAction={onClearSearch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <RepositoryList repositories={items} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isFetching}
      />
    </div>
  );
};
