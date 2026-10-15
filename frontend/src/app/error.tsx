'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Boundary caught:', error);
  }, [error]);

  return (
    <PageContainer className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-12 h-12 rounded-full bg-status-error/15 text-status-error flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-typography-primary mb-2">Something went wrong</h2>
      <p className="text-xs text-typography-secondary max-w-sm mb-6 leading-relaxed">
        {error.message || 'An unexpected runtime error occurred while loading this view.'}
      </p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => reset()}
        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
      >
        Try Again
      </Button>
    </PageContainer>
  );
}
