'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ExternalLink, Calendar, Star, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LanguageIndicator } from '@/components/repositories/LanguageIndicator';
import { formatCompactNumber, formatExactNumber } from '@/lib/formatNumber';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { SavedRepository } from '@/types/savedRepository';

interface SavedRepositoryCardProps {
  repository: SavedRepository;
  onRemove: (repo: SavedRepository) => void;
  isRemoving?: boolean;
}

export const SavedRepositoryCard: React.FC<SavedRepositoryCardProps> = ({
  repository,
  onRemove,
  isRemoving,
}) => {
  const detailUrl = `/repositories/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`;

  return (
    <article className="rounded-lg border border-app-border bg-app-surface p-4 sm:p-5 transition-all duration-150 hover:border-typography-muted/40 hover:shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={detailUrl}
              className="text-sm font-semibold text-primary hover:underline truncate block"
            >
              {repository.owner} / <span className="text-typography-primary font-bold">{repository.name}</span>
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-typography-muted mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>Saved {formatRelativeTime(repository.savedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={repository.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-typography-muted hover:text-typography-primary rounded hover:bg-app-elevated transition-colors"
              title="Open on GitHub"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(repository)}
              isLoading={isRemoving}
              className="text-status-error hover:bg-status-error/10 h-7 w-7 p-0"
              title="Remove from saved"
              aria-label={`Remove ${repository.fullName} from saved`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-typography-secondary mt-2.5 line-clamp-2 leading-relaxed">
          {repository.description || (
            <span className="italic text-typography-muted">No description provided.</span>
          )}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-app-border-subtle flex items-center justify-between gap-3 text-xs text-typography-secondary">
        <LanguageIndicator language={repository.language} />

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 text-typography-secondary"
            title={`${formatExactNumber(repository.stars)} stars`}
          >
            <Star className="w-3.5 h-3.5 text-status-warning fill-status-warning/20" />
            <span className="text-xs">{formatCompactNumber(repository.stars)}</span>
          </div>
          <div
            className="flex items-center gap-1 text-typography-secondary"
            title={`${formatExactNumber(repository.forks)} forks`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span className="text-xs">{formatCompactNumber(repository.forks)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
