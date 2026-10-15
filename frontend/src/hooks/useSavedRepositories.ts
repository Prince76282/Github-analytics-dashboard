'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSavedRepositories,
  getSavedRepositoryStatus,
  saveRepository,
  removeSavedRepository,
} from '@/services/api/savedRepositoryApi';
import { queryKeys } from '@/lib/queryKeys';
import { Repository } from '@/types/repository';

export function useSavedRepositories(activeOwner?: string, activeRepo?: string) {
  const queryClient = useQueryClient();

  const savedListQuery = useQuery({
    queryKey: queryKeys.savedRepositories,
    queryFn: getSavedRepositories,
    staleTime: 30 * 1000,
  });

  const isCheckEnabled = Boolean(activeOwner && activeRepo);
  const statusQuery = useQuery({
    queryKey: queryKeys.savedRepositoryStatus(activeOwner || '', activeRepo || ''),
    queryFn: () => getSavedRepositoryStatus(activeOwner!, activeRepo!),
    enabled: isCheckEnabled,
    staleTime: 30 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: (repo: Repository) => saveRepository(repo),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedRepositories });
      queryClient.invalidateQueries({
        queryKey: queryKeys.savedRepositoryStatus(variables.owner.login, variables.name),
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ owner, repo }: { owner: string; repo: string }) =>
      removeSavedRepository(owner, repo),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedRepositories });
      queryClient.invalidateQueries({
        queryKey: queryKeys.savedRepositoryStatus(variables.owner, variables.repo),
      });
    },
  });

  return {
    savedRepositories: savedListQuery.data || [],
    isLoadingList: savedListQuery.isLoading,
    isErrorList: savedListQuery.isError,
    listError: savedListQuery.error,
    isSaved: statusQuery.data?.isSaved ?? false,
    isLoadingStatus: statusQuery.isLoading,
    saveRepository: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    removeRepository: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    refetchList: savedListQuery.refetch,
  };
}
