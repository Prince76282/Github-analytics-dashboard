'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { RepositorySearchForm } from '@/components/search/RepositorySearchForm';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useRepositorySearch } from '@/hooks/useRepositorySearch';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = (searchParams.get('sort') as 'stars' | 'updated') || 'stars';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useRepositorySearch({
    q: query,
    page,
    per_page: 20,
    sort,
  });

  const updateSearchUrl = (newQuery: string, newPage: number, newSort: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newPage > 1) params.set('page', newPage.toString());
    if (newSort && newSort !== 'stars') params.set('sort', newSort);

    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (newQuery: string) => {
    updateSearchUrl(newQuery, 1, sort);
  };

  const handleSortChange = (newSort: 'stars' | 'updated') => {
    updateSearchUrl(query, 1, newSort);
  };

  const handlePageChange = (newPage: number) => {
    updateSearchUrl(query, newPage, sort);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer className="space-y-6">
      {/* Header and Search Form */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-typography-primary">
          Search Repositories
        </h1>
        <p className="text-xs sm:text-sm text-typography-secondary mt-1">
          Find and explore public GitHub repositories.
        </p>

        <div className="mt-4">
          <RepositorySearchForm
            initialQuery={query}
            onSearch={handleSearchSubmit}
            isLoading={isLoading || isFetching}
          />
        </div>
      </div>

      {/* Query state handling */}
      {!query ? (
        <EmptyState
          icon={SearchIcon}
          title="Search for repositories"
          description="Enter keywords, a repository name, or an organization to get started."
        />
      ) : isError ? (
        <ErrorState
          title="Search request failed"
          message={error?.message || 'Could not fetch repositories from GitHub.'}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : (
        <div className="space-y-4">
          <SearchFilters
            query={query}
            totalCount={data?.totalCount || 0}
            currentPage={page}
            perPage={20}
            cached={data?.cached}
            sort={sort}
            onSortChange={handleSortChange}
            isLoading={isLoading || isFetching}
          />

          <SearchResults
            query={query}
            items={data?.items || []}
            totalCount={data?.totalCount || 0}
            totalPages={data?.totalPages || 1}
            currentPage={page}
            isLoading={isLoading}
            isFetching={isFetching}
            onPageChange={handlePageChange}
            onClearSearch={() => updateSearchUrl('', 1, 'stars')}
          />
        </div>
      )}
    </PageContainer>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<PageContainer><div className="animate-pulse h-12 bg-app-elevated rounded" /></PageContainer>}>
      <SearchPageContent />
    </Suspense>
  );
}
