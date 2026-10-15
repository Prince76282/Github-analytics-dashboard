'use client';

import React, { useState, useMemo } from 'react';
import { Search, BookmarkCheck, SlidersHorizontal } from 'lucide-react';
import { SavedRepositoryCard } from './SavedRepositoryCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSavedRepositories } from '@/hooks/useSavedRepositories';
import { useToast } from '@/components/feedback/ToastProvider';
import { SavedRepository } from '@/types/savedRepository';

export const SavedRepositoryList: React.FC = () => {
  const {
    savedRepositories,
    isLoadingList,
    removeRepository,
    isRemoving,
  } = useSavedRepositories();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'stars' | 'name'>('recent');
  const [repoToDelete, setRepoToDelete] = useState<SavedRepository | null>(null);

  const filteredRepositories = useMemo(() => {
    let result = [...savedRepositories];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.language && r.language.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars;
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
      // default: recent
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });

    return result;
  }, [savedRepositories, searchTerm, sortBy]);

  const handleConfirmDelete = async () => {
    if (!repoToDelete) return;
    try {
      await removeRepository({
        owner: repoToDelete.owner,
        repo: repoToDelete.name,
      });
      toast(`Successfully removed ${repoToDelete.fullName} from saved repositories.`, 'info');
      setRepoToDelete(null);
    } catch (err: any) {
      toast(err.message || 'Failed to remove repository.', 'error');
    }
  };

  if (isLoadingList) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border border-app-border rounded-lg bg-app-surface space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
            <div className="pt-2 flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (savedRepositories.length === 0) {
    return (
      <EmptyState
        icon={BookmarkCheck}
        title="No saved repositories yet"
        description="Your saved favourites list is currently empty. Star and save public repositories from the search page to organize them in your persistent workspace."
        actionLabel="Explore & Search Repositories"
        actionHref="/search"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls: Search filter + sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Filter saved repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            options={[
              { value: 'recent', label: 'Recently Saved' },
              { value: 'stars', label: 'Most Stars' },
              { value: 'name', label: 'Alphabetical' },
            ]}
          />
        </div>
      </div>

      {filteredRepositories.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-app-border rounded-lg text-xs text-typography-muted">
          No saved repositories match "{searchTerm}". Try clearing your search filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepositories.map((repo) => (
            <SavedRepositoryCard
              key={repo._id || repo.fullName}
              repository={repo}
              onRemove={(r) => setRepoToDelete(r)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(repoToDelete)}
        title="Remove Saved Repository?"
        description={`Are you sure you want to remove "${repoToDelete?.fullName}" from your saved favourites? You can save it again anytime from the repository page.`}
        confirmLabel="Remove Repository"
        cancelLabel="Keep Saved"
        isDestructive={true}
        isLoading={isRemoving}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRepoToDelete(null)}
      />
    </div>
  );
};
