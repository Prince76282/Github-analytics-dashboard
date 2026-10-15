import React from 'react';
import { AlertCircle, GitPullRequest, Info, ExternalLink } from 'lucide-react';
import { formatExactNumber } from '@/lib/formatNumber';
import { IssuesSummary } from '@/types/repository';

interface OpenIssuesSummaryProps {
  summary?: IssuesSummary;
  owner: string;
  repo: string;
  isLoading?: boolean;
}

export const OpenIssuesSummary: React.FC<OpenIssuesSummaryProps> = ({
  summary,
  owner,
  repo,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 border border-app-border rounded-lg bg-app-surface animate-pulse">
        <div className="h-6 bg-app-border rounded w-20 mb-2" />
        <div className="h-3 bg-app-border rounded w-48" />
      </div>
    );
  }

  const pureCount = summary?.pureOpenIssuesCount ?? 0;
  const combinedCount = summary?.openIssuesCount ?? 0;
  const prCount = summary?.openPullRequestsCount ?? Math.max(0, combinedCount - pureCount);

  return (
    <div className="rounded-lg border border-app-border bg-app-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-typography-secondary">
            Open Issues
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-typography-primary">
              {formatExactNumber(pureCount)}
            </span>
            <span className="text-xs text-typography-muted">open issues</span>
          </div>
        </div>

        <a
          href={`https://github.com/${owner}/${repo}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="mt-4 pt-3 border-t border-app-border grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-typography-secondary">
          <AlertCircle className="w-4 h-4 text-status-warning shrink-0" />
          <div>
            <span className="font-semibold text-typography-primary">
              {formatExactNumber(pureCount)}
            </span>{' '}
            Issues
          </div>
        </div>

        <div className="flex items-center gap-2 text-typography-secondary">
          <GitPullRequest className="w-4 h-4 text-primary shrink-0" />
          <div>
            <span className="font-semibold text-typography-primary">
              {formatExactNumber(prCount)}
            </span>{' '}
            Pull Requests
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 p-2.5 rounded bg-app-elevated text-[11px] text-typography-secondary">
        <Info className="w-3.5 h-3.5 text-typography-muted shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          GitHub's default issue counter includes pull requests. Here, issues and pull requests are separated for clarity.
        </p>
      </div>
    </div>
  );
};
