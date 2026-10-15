import React from 'react';
import { GitCommit, ExternalLink, Calendar } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { CommitItem } from '@/types/repository';

interface CommitListProps {
  commits: CommitItem[];
  isLoading?: boolean;
}

export const CommitList: React.FC<CommitListProps> = ({ commits, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 border border-app-border rounded bg-app-elevated/40 animate-pulse">
            <div className="h-3 bg-app-border rounded w-3/4 mb-2" />
            <div className="h-2.5 bg-app-border rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className="p-4 border border-dashed border-app-border rounded text-center text-xs text-typography-muted">
        No recent commits recorded or repository is empty.
      </div>
    );
  }

  return (
    <div className="divide-y divide-app-border border border-app-border rounded-lg bg-app-surface overflow-hidden">
      {commits.map((commit) => (
        <div
          key={commit.sha}
          className="p-3.5 flex items-start justify-between gap-3 hover:bg-app-elevated/50 transition-colors"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 text-primary">
              <GitCommit className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-typography-primary line-clamp-2 leading-relaxed">
                {commit.message}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-typography-secondary">
                <span className="font-semibold text-typography-primary flex items-center gap-1.5">
                  {commit.authorAvatarUrl && (
                    <Avatar
                      src={commit.authorAvatarUrl}
                      alt={commit.authorName}
                      size="xs"
                    />
                  )}
                  {commit.authorName}
                </span>
                <span className="flex items-center gap-1 text-typography-muted">
                  <Calendar className="w-3 h-3" />
                  {formatRelativeTime(commit.authorDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-app-elevated text-typography-secondary border border-app-border">
              {commit.shortSha}
            </code>
            <a
              href={commit.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-typography-muted hover:text-primary transition-colors"
              title="View commit on GitHub"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
