'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { RepositoryHeader } from '@/components/repositories/RepositoryHeader';
import { CommitList } from '@/components/repositories/CommitList';
import { ContributorList } from '@/components/repositories/ContributorList';
import { OpenIssuesSummary } from '@/components/repositories/OpenIssuesSummary';
import { RepositoryCharts } from '@/components/repositories/RepositoryCharts';
import { useRepositoryDetails } from '@/hooks/useRepositoryDetails';

export default function RepositoryDetailPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const {
    repository,
    commits,
    contributors,
    issues,
    isLoading,
    isError,
    error,
    refetchAll,
  } = useRepositoryDetails(owner, repo);

  if (isLoading) {
    return (
      <PageContainer className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="p-6 border border-app-border rounded-lg bg-app-surface space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !repository.data) {
    return (
      <PageContainer className="py-12">
        <ErrorState
          title={`Repository "${owner}/${repo}" unavailable`}
          message={
            error?.message ||
            'This repository could not be found or GitHub API limit was exceeded.'
          }
          onRetry={refetchAll}
        />
        <div className="text-center mt-4">
          <Link href="/search">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Search
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const repoData = repository.data;

  return (
    <PageContainer className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs text-typography-secondary hover:text-typography-primary font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Search</span>
        </Link>
      </div>

      {/* Main Repository Header Card */}
      <RepositoryHeader repository={repoData} />

      {/* Analytics Charts */}
      <section>
        <RepositoryCharts
          repository={repoData}
          contributors={contributors.data || []}
        />
      </section>

      {/* Detailed Information Grid: Commits, Contributors, Open Issues */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Five Commits */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-typography-secondary">
              Latest 5 Commits
            </h2>
            <a
              href={`https://github.com/${owner}/${repo}/commits`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <span>Commit history</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {commits.isError ? (
            <div className="p-4 border border-status-error/30 rounded-lg bg-status-error/5 text-xs text-typography-secondary">
              Unable to load commits from GitHub: {commits.error?.message}
            </div>
          ) : (
            <CommitList commits={commits.data || []} isLoading={commits.isLoading} />
          )}
        </div>

        {/* Top 5 Contributors & Issues Backlog */}
        <div className="space-y-6">
          {/* Top 5 Contributors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-typography-secondary">
                Top 5 Contributors
              </h2>
              <a
                href={`https://github.com/${owner}/${repo}/graphs/contributors`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span>Contributors graph</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {contributors.isError ? (
              <div className="p-4 border border-status-error/30 rounded-lg bg-status-error/5 text-xs text-typography-secondary">
                Unable to load contributors: {contributors.error?.message}
              </div>
            ) : (
              <ContributorList
                contributors={contributors.data || []}
                isLoading={contributors.isLoading}
              />
            )}
          </div>

          {/* Open Issues Count Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-typography-secondary">
              Open Issues
            </h2>
            <OpenIssuesSummary
              summary={issues.data}
              owner={owner}
              repo={repo}
              isLoading={issues.isLoading}
            />
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
