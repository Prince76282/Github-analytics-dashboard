import React from 'react';
import { ExternalLink, Users } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { formatCompactNumber } from '@/lib/formatNumber';
import { ContributorItem } from '@/types/repository';

interface ContributorListProps {
  contributors: ContributorItem[];
  isLoading?: boolean;
}

export const ContributorList: React.FC<ContributorListProps> = ({
  contributors,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-2.5 border border-app-border rounded bg-app-elevated/40 animate-pulse flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-app-border" />
            <div className="h-3 bg-app-border rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (contributors.length === 0) {
    return (
      <div className="p-4 border border-dashed border-app-border rounded text-center text-xs text-typography-muted">
        No contributors available for this repository.
      </div>
    );
  }

  return (
    <div className="divide-y divide-app-border border border-app-border rounded-lg bg-app-surface overflow-hidden">
      {contributors.map((c, index) => (
        <div
          key={c.id || c.login}
          className="p-3 flex items-center justify-between gap-3 hover:bg-app-elevated/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-mono font-semibold text-typography-muted w-4 text-right">
              #{index + 1}
            </span>
            <Avatar src={c.avatarUrl} alt={c.login} size="sm" />
            <span className="text-xs font-semibold text-typography-primary truncate">
              {c.login}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-typography-secondary bg-app-elevated px-2 py-0.5 rounded border border-app-border">
              {formatCompactNumber(c.contributions)} commits
            </span>
            <a
              href={c.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-typography-muted hover:text-primary transition-colors"
              title={`View ${c.login} on GitHub`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
