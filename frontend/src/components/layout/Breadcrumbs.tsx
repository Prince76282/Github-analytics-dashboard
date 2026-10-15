'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return <span className="text-xs font-semibold text-typography-primary">Overview</span>;
  }

  const breadcrumbs = segments.map((seg, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    const label = decodeURIComponent(seg);

    return (
      <span key={href} className="inline-flex items-center gap-1.5 text-xs">
        {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-typography-muted" />}
        {isLast ? (
          <span className="font-semibold text-typography-primary truncate max-w-[160px] sm:max-w-xs">
            {label}
          </span>
        ) : (
          <Link href={href} className="text-typography-secondary hover:text-typography-primary">
            {label}
          </Link>
        )}
      </span>
    );
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-hidden">
      <Link href="/" className="text-xs text-typography-secondary hover:text-typography-primary">
        Home
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-typography-muted shrink-0" />
      {breadcrumbs}
    </nav>
  );
};
