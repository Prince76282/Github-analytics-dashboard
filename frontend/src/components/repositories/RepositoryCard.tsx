import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { LanguageIndicator } from './LanguageIndicator';
import { RepositoryStats } from './RepositoryStats';
import { RepositoryActions } from './RepositoryActions';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { Repository } from '@/types/repository';

interface RepositoryCardProps {
  repository: Repository;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  const detailUrl = `/repositories/${encodeURIComponent(repository.owner.login)}/${encodeURIComponent(repository.name)}`;

  return (
    <article className="group relative rounded-lg border border-app-border bg-app-surface p-4 sm:p-5 transition-all duration-150 hover:border-typography-muted/40 hover:shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar
            src={repository.owner.avatarUrl}
            alt={repository.owner.login}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={detailUrl}
                className="text-sm font-semibold text-primary hover:underline truncate"
              >
                {repository.owner.login} / <span className="text-typography-primary font-bold">{repository.name}</span>
              </Link>
              <Badge variant="subtle" size="sm">
                {repository.isPrivate ? 'Private' : 'Public'}
              </Badge>
            </div>

            <p className="text-xs text-typography-secondary mt-1.5 line-clamp-2 leading-relaxed">
              {repository.description || (
                <span className="italic text-typography-muted">No description provided.</span>
              )}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <RepositoryActions repository={repository} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-app-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-typography-secondary">
        <div className="flex items-center gap-4">
          <LanguageIndicator language={repository.language} />
          <RepositoryStats
            stars={repository.stars}
            forks={repository.forks}
            openIssues={repository.openIssuesCount}
          />
        </div>

        <div className="text-[11px] text-typography-muted">
          Updated {formatRelativeTime(repository.updatedAt)}
        </div>
      </div>
    </article>
  );
};
