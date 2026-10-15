'use client';

import React from 'react';
import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSavedRepositories } from '@/hooks/useSavedRepositories';
import { useToast } from '@/components/feedback/ToastProvider';
import { Repository } from '@/types/repository';

interface RepositoryActionsProps {
  repository: Repository;
  size?: 'sm' | 'md';
}

export const RepositoryActions: React.FC<RepositoryActionsProps> = ({
  repository,
  size = 'sm',
}) => {
  const { isSaved, isSaving, isRemoving, saveRepository, removeRepository } =
    useSavedRepositories(repository.owner.login, repository.name);
  const { toast } = useToast();

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isSaved) {
        await removeRepository({
          owner: repository.owner.login,
          repo: repository.name,
        });
        toast(`Removed ${repository.fullName} from saved repositories.`, 'info');
      } else {
        await saveRepository(repository);
        toast(`Saved ${repository.fullName} to favourites!`, 'success');
      }
    } catch (err: any) {
      toast(err.message || 'Action failed. Please try again.', 'error');
    }
  };

  const isLoading = isSaving || isRemoving;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isSaved ? 'soft' : 'outline'}
        size={size}
        onClick={handleToggleSave}
        isLoading={isLoading}
        leftIcon={
          isSaved ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )
        }
        aria-label={isSaved ? 'Remove from saved' : 'Save repository'}
      >
        {isSaved ? 'Saved' : 'Save'}
      </Button>

      <a
        href={repository.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center justify-center h-8 w-8 rounded border border-app-border text-typography-secondary hover:text-typography-primary hover:bg-app-elevated transition-colors"
        title="View on GitHub"
        aria-label={`Open ${repository.fullName} on GitHub`}
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
