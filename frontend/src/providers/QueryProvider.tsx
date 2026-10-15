'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute client freshness
            gcTime: 5 * 60 * 1000,
            retry: (failureCount, error) => {
              // Avoid retrying on 404 or rate limits
              const msg = error.message.toLowerCase();
              if (msg.includes('404') || msg.includes('not found') || msg.includes('rate limit')) {
                return false;
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
