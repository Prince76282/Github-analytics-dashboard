import React from 'react';
import { RepositoryCard } from './RepositoryCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Repository } from '@/types/repository';

interface RepositoryListProps {
  repositories: Repository[];
  isLoading?: boolean;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-app-border bg-app-surface p-5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80 max-w-full" />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </div>
  );
};
