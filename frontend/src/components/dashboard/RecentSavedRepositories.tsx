'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, ArrowRight, BookmarkCheck } from 'lucide-react';
import { SavedRepositoryCard } from '@/components/saved/SavedRepositoryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSavedRepositories } from '@/hooks/useSavedRepositories';
import { useToast } from '@/components/feedback/ToastProvider';
import { SavedRepository } from '@/types/savedRepository';

export const RecentSavedRepositories: React.FC = () => {
  const { savedRepositories, isLoadingList, removeRepository } = useSavedRepositories();
  const { toast } = useToast();

  const handleRemove = async (repo: SavedRepository) => {
    try {
      await removeRepository({ owner: repo.owner, repo: repo.name });
      toast(`Removed ${repo.fullName} from saved repositories.`, 'info');
    } catch (err: any) {
      toast(err.message || 'Failed to remove repository.', 'error');
    }
  };

  const recentItems = savedRepositories.slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-typography-secondary flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" />
            Recently Saved Repositories
          </h2>
          <p className="text-xs text-typography-muted mt-0.5">
            Persisted in MongoDB database ({savedRepositories.length} total)
          </p>
        </div>

        {savedRepositories.length > 0 && (
          <Link
            href="/saved"
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
          >
            <span>View all saved</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {isLoadingList ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border border-app-border rounded-lg bg-app-surface space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : recentItems.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No saved repositories yet"
          description="You haven't bookmarked any repositories yet. Use the search field above to find interesting repositories and save them to your database."
          actionLabel="Find Repositories"
          actionHref="/search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentItems.map((repo) => (
            <SavedRepositoryCard
              key={repo._id || repo.fullName}
              repository={repo}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
};
