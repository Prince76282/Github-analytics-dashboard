'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface RepositorySearchFormProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const RepositorySearchForm: React.FC<RepositorySearchFormProps> = ({
  initialQuery = '',
  onSearch,
  isLoading = false,
  className,
}) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col sm:flex-row gap-2.5 items-stretch w-full', className)}
    >
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-typography-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories by topic, name, keyword (e.g., 'react', 'next.js', 'fastapi')..."
          className="w-full h-11 pl-10 pr-10 rounded-md border border-app-border bg-app-surface text-sm text-typography-primary placeholder:text-typography-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-colors"
          aria-label="Search repositories"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 text-typography-muted hover:text-typography-primary rounded transition-colors"
            title="Clear search input"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        leftIcon={!isLoading && <Search className="w-4 h-4" />}
        disabled={!query.trim()}
      >
        Search Repositories
      </Button>
    </form>
  );
};
