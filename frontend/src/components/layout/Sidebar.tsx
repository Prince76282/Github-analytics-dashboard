'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GitBranch, BookmarkCheck } from 'lucide-react';
import { MAIN_NAV_ITEMS } from '@/config/navigation';
import { useSavedRepositories } from '@/hooks/useSavedRepositories';
import { cn } from '@/lib/cn';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onItemClick }) => {
  const pathname = usePathname();
  const { savedRepositories } = useSavedRepositories();

  return (
    <aside
      className={cn(
        'w-64 border-r border-app-border bg-app-surface flex flex-col justify-between shrink-0 select-none h-full',
        className
      )}
    >
      <div>
        {/* Brand */}
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-app-border">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-xs shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-bold tracking-tight text-typography-primary truncate" title="GITHUBRUPOCONTECTER">
              GITHUBRUPOCONTECTER
            </h1>
            <p className="text-[10px] text-typography-muted truncate">
              Repository Explorer
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1" aria-label="Main Navigation">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-typography-muted">
            Workspace
          </div>

          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const isSavedNav = item.href === '/saved';

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors',
                  isActive
                    ? 'bg-primary-soft text-primary font-semibold'
                    : 'text-typography-secondary hover:text-typography-primary hover:bg-app-elevated'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-typography-muted')} />
                  <span>{item.name}</span>
                </div>

                {isSavedNav && savedRepositories.length > 0 && (
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-app-elevated text-typography-primary border border-app-border">
                    {savedRepositories.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer metadata */}
      <div className="p-4 border-t border-app-border text-[11px] text-typography-muted space-y-1">
        <div className="flex items-center justify-between">
          <span>Backend Cache TTL</span>
          <span className="font-mono text-typography-primary font-semibold">300s (5m)</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Persistence</span>
          <span className="font-mono text-status-success font-semibold">MongoDB</span>
        </div>
      </div>
    </aside>
  );
};
