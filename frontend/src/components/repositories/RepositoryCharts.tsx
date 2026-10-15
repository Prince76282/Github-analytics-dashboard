'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Repository, ContributorItem } from '@/types/repository';
import { formatCompactNumber } from '@/lib/formatNumber';
import { useTheme } from '@/providers/ThemeProvider';

interface RepositoryChartsProps {
  repository: Repository;
  contributors: ContributorItem[];
}

export const RepositoryCharts: React.FC<RepositoryChartsProps> = ({
  repository,
  contributors,
}) => {
  const { theme } = useTheme();

  const metricsData = [
    { name: 'Stars', value: repository.stars, color: theme.colors.primary },
    { name: 'Forks', value: repository.forks, color: theme.colors.warning },
    { name: 'Watchers', value: repository.watchers, color: theme.colors.success },
    { name: 'Issues', value: repository.openIssuesCount, color: theme.colors.error },
  ];

  const contributorData = contributors.slice(0, 5).map((c) => ({
    name: c.login,
    contributions: c.contributions,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Metrics Breakdown Chart */}
      <div className="rounded-lg border border-app-border bg-app-surface p-4 sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-typography-secondary mb-1">
          Engagement Metrics Overview
        </h3>
        <p className="text-xs text-typography-muted mb-4">
          Comparative volume of community stars, forks, watchers, and issue backlog
        </p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metricsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: theme.colors.textSecondary }}
                axisLine={{ stroke: theme.colors.border }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val) => formatCompactNumber(val)}
                tick={{ fontSize: 10, fill: theme.colors.textSecondary }}
                axisLine={{ stroke: theme.colors.border }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString(), 'Count']}
                contentStyle={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: 6,
                  fontSize: 12,
                  color: theme.colors.textPrimary,
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {metricsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contributor Contributions Chart */}
      <div className="rounded-lg border border-app-border bg-app-surface p-4 sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-typography-secondary mb-1">
          Top Contributor Commit Volume
        </h3>
        <p className="text-xs text-typography-muted mb-4">
          Distribution of contributions among the top ranked maintainers
        </p>

        {contributorData.length > 0 ? (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contributorData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(val) => formatCompactNumber(val)}
                  tick={{ fontSize: 10, fill: theme.colors.textSecondary }}
                  axisLine={{ stroke: theme.colors.border }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: theme.colors.textSecondary }}
                  axisLine={{ stroke: theme.colors.border }}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), 'Commits']}
                  contentStyle={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderRadius: 6,
                    fontSize: 12,
                    color: theme.colors.textPrimary,
                  }}
                />
                <Bar dataKey="contributions" fill={theme.colors.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center text-xs text-typography-muted border border-dashed border-app-border rounded">
            Contributor activity data unavailable
          </div>
        )}
      </div>
    </div>
  );
};
