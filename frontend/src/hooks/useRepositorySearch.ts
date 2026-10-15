'use client';

import { useQuery } from '@tanstack/react-query';
import { searchRepositories, SearchParams } from '@/services/api/searchApi';
import { queryKeys } from '@/lib/queryKeys';

export function useRepositorySearch(params: SearchParams) {
  const query = params.q.trim();
  const page = params.page || 1;
  const perPage = params.per_page || 20;
  const sort = params.sort || 'stars';
  const order = params.order || 'desc';

  return useQuery({
    queryKey: queryKeys.githubSearch(query, page, perPage, sort),
    queryFn: () => searchRepositories({ q: query, page, per_page: perPage, sort, order }),
    enabled: query.length > 0,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes matching backend cache
  });
}
