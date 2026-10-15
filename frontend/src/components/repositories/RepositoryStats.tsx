import React from 'react';
import { Star, GitFork, AlertCircle, Eye } from 'lucide-react';
import { formatCompactNumber, formatExactNumber } from '@/lib/formatNumber';
import { cn } from '@/lib/cn';

interface RepositoryStatsProps {
  stars: number;
  forks: number;
  openIssues?: number;
  watchers?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export const RepositoryStats: React.FC<RepositoryStatsProps> = ({
  stars,
  forks,
  openIssues,
  watchers,
  className,
  size = 'sm',
}) => {
  const isSm = size === 'sm';
  const iconClass = isSm ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textClass = isSm ? 'text-xs' : 'text-sm font-semibold';

  return (
    <div className={cn('flex flex-wrap items-center gap-3 sm:gap-4 text-typography-secondary', className)}>
      <div
        className="flex items-center gap-1 hover:text-typography-primary transition-colors cursor-help"
        title={`${formatExactNumber(stars)} stars`}
      >
        <Star className={cn(iconClass, 'text-status-warning fill-status-warning/20')} />
        <span className={textClass}>{formatCompactNumber(stars)}</span>
      </div>

      <div
        className="flex items-center gap-1 hover:text-typography-primary transition-colors cursor-help"
        title={`${formatExactNumber(forks)} forks`}
      >
        <GitFork className={iconClass} />
        <span className={textClass}>{formatCompactNumber(forks)}</span>
      </div>

      {openIssues !== undefined && (
        <div
          className="flex items-center gap-1 hover:text-typography-primary transition-colors cursor-help"
          title={`${formatExactNumber(openIssues)} open issues`}
        >
          <AlertCircle className={iconClass} />
          <span className={textClass}>{formatCompactNumber(openIssues)}</span>
        </div>
      )}

      {watchers !== undefined && (
        <div
          className="flex items-center gap-1 hover:text-typography-primary transition-colors cursor-help"
          title={`${formatExactNumber(watchers)} watchers`}
        >
          <Eye className={iconClass} />
          <span className={textClass}>{formatCompactNumber(watchers)}</span>
        </div>
      )}
    </div>
  );
};
