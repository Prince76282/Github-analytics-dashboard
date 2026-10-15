import React from 'react';
import Link from 'next/link';
import { Search, Bookmark, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const WelcomeSection: React.FC = () => {
  return (
    <section className="p-6 sm:p-8 rounded-xl border border-app-border bg-gradient-to-r from-app-surface to-app-surface/50 shadow-xs space-y-4">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>GitHub Repository Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-typography-primary">
          GitHub Analytics Dashboard
        </h1>
        <p className="text-sm sm:text-base text-typography-secondary mt-2 leading-relaxed">
          Search GitHub repositories, check recent commits, inspect contributors and issues, and bookmark projects for quick access.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/search">
          <Button variant="primary" size="sm" leftIcon={<Search className="w-4 h-4" />}>
            Search Repositories
          </Button>
        </Link>
        <Link href="/saved">
          <Button variant="outline" size="sm" leftIcon={<Bookmark className="w-4 h-4" />}>
            Saved Repositories
          </Button>
        </Link>
      </div>
    </section>
  );
};
