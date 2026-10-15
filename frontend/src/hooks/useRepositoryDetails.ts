'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getRepositoryDetails,
  getLatestCommits,
  getTopContributors,
  getIssuesSummary,
} from '@/services/api/repositoryApi';
import { queryKeys } from '@/lib/queryKeys';

export function useRepositoryDetails(owner: string, repo: string) {
  const isEnabled = Boolean(owner && repo);

  const repoQuery = useQuery({
    queryKey: queryKeys.repository(owner, repo),
    queryFn: () => getRepositoryDetails(owner, repo),
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
  });

  const commitsQuery = useQuery({
    queryKey: queryKeys.repositoryCommits(owner, repo, 5),
    queryFn: () => getLatestCommits(owner, repo, 5),
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
  });

  const contributorsQuery = useQuery({
    queryKey: queryKeys.repositoryContributors(owner, repo, 5),
    queryFn: () => getTopContributors(owner, repo, 5),
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
  });

  const issuesQuery = useQuery({
    queryKey: queryKeys.repositoryIssuesSummary(owner, repo),
    queryFn: () => getIssuesSummary(owner, repo),
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    repository: repoQuery,
    commits: commitsQuery,
    contributors: contributorsQuery,
    issues: issuesQuery,
    isLoading: repoQuery.isLoading,
    isError: repoQuery.isError,
    error: repoQuery.error,
    refetchAll: () => {
      repoQuery.refetch();
      commitsQuery.refetch();
      contributorsQuery.refetch();
      issuesQuery.refetch();
    },
  };
}
