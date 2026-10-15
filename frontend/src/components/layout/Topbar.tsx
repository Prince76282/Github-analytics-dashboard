'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, Palette } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useTheme } from '@/providers/ThemeProvider';
import { ThemeId } from '@/config/themes';

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const { themeId, setThemeId, availableThemes } = useTheme();

  return (
    <header className="h-14 border-b border-app-border bg-app-surface px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 text-typography-secondary hover:text-typography-primary rounded hover:bg-app-elevated transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/search"
          className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded border border-app-border bg-app-elevated/50 text-xs text-typography-muted hover:text-typography-primary hover:border-typography-muted/40 transition-colors"
          title="Search Repositories"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search...</span>
          <kbd className="font-mono text-[10px] bg-app-surface px-1.5 py-0.2 rounded border border-app-border">
            /
          </kbd>
        </Link>

        {/* Theme Selector */}
        <div className="flex items-center gap-1.5 border-l border-app-border pl-3">
          <Palette className="w-3.5 h-3.5 text-typography-muted" />
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value as ThemeId)}
            className="text-xs bg-transparent text-typography-secondary hover:text-typography-primary border-none focus:outline-none cursor-pointer pr-1"
            aria-label="Select Color Theme"
          >
            {availableThemes.map((t) => (
              <option key={t.id} value={t.id} className="bg-app-surface text-typography-primary">
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
