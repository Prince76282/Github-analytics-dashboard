'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const QUICK_SUGGESTIONS = [
  'react',
  'next.js',
  'typescript',
  'tailwindcss',
  'express',
  'vitest',
];

export const QuickSearch: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="rounded-lg border border-app-border bg-app-surface p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-typography-secondary">
          Repository Discovery
        </h2>
        <p className="text-xs text-typography-muted mt-0.5">
          Type any public repository name, organization, or technology keyword.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-typography-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords (e.g., 'facebook/react', 'fastapi', 'prisma')..."
            className="w-full h-11 pl-10 pr-4 rounded border border-app-border bg-app-bg text-sm text-typography-primary placeholder:text-typography-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!query.trim()}
          leftIcon={<Search className="w-4 h-4" />}
        >
          Explore Repositories
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-typography-secondary">
        <span className="text-typography-muted font-medium">Quick suggestions:</span>
        {QUICK_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSuggestionClick(s)}
            className="px-2.5 py-1 rounded bg-app-elevated border border-app-border hover:border-primary/50 hover:text-primary transition-colors text-xs font-mono"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
