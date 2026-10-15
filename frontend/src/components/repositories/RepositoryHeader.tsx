import React from 'react';
import { GitBranch, Calendar, Scale, ExternalLink, Clock } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { LanguageIndicator } from './LanguageIndicator';
import { RepositoryStats } from './RepositoryStats';
import { RepositoryActions } from './RepositoryActions';
import { formatDate } from '@/lib/formatDate';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { Repository } from '@/types/repository';

interface RepositoryHeaderProps {
  repository: Repository;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({ repository }) => {
  return (
    <section className="rounded-lg border border-app-border bg-app-surface p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <Avatar
            src={repository.owner.avatarUrl}
            alt={repository.owner.login}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-typography-primary break-all">
                <a
                  href={repository.owner.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {repository.owner.login}
                </a>
                <span className="text-typography-muted mx-1">/</span>
                <span>{repository.name}</span>
              </h1>
              <Badge variant="outline" size="sm">
                {repository.isPrivate ? 'Private' : 'Public'}
              </Badge>
              {repository.isFork && (
                <Badge variant="subtle" size="sm">
                  Forked
                </Badge>
              )}
            </div>

            <p className="text-xs sm:text-sm text-typography-secondary mt-2 leading-relaxed">
              {repository.description || (
                <span className="italic text-typography-muted">No description provided.</span>
              )}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <RepositoryActions repository={repository} size="md" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="pt-4 border-t border-app-border-subtle flex flex-wrap items-center justify-between gap-4">
        <RepositoryStats
          stars={repository.stars}
          forks={repository.forks}
          openIssues={repository.openIssuesCount}
          watchers={repository.watchers}
          size="md"
        />

        <div className="flex flex-wrap items-center gap-3 text-xs text-typography-secondary">
          <LanguageIndicator language={repository.language} />

          <div className="flex items-center gap-1.5 text-typography-muted">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Default: <strong className="text-typography-primary">{repository.defaultBranch}</strong></span>
          </div>

          {repository.license && (
            <div className="flex items-center gap-1.5 text-typography-muted">
              <Scale className="w-3.5 h-3.5" />
              <span>License: <strong className="text-typography-primary">{repository.license.spdxId || repository.license.name}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Dates & Topics */}
      <div className="pt-3 border-t border-app-border-subtle flex flex-wrap items-center justify-between gap-3 text-[11px] text-typography-muted">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Created: {formatDate(repository.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated: {formatRelativeTime(repository.updatedAt)}
          </span>
        </div>

        <a
          href={repository.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {repository.topics && repository.topics.length > 0 && (
        <div className="pt-3 border-t border-app-border-subtle flex flex-wrap gap-1.5">
          {repository.topics.map((topic: string) => (
            <span
              key={topic}
              className="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary font-mono"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};
