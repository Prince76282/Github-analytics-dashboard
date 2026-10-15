import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <PageContainer className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-12 h-12 rounded-full bg-app-elevated border border-app-border flex items-center justify-center text-typography-muted mb-4">
        <FileQuestion className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-typography-primary mb-2">Page Not Found</h2>
      <p className="text-xs text-typography-secondary max-w-sm mb-6 leading-relaxed">
        The requested repository or dashboard page does not exist or may have been moved.
      </p>
      <Link href="/">
        <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
          Return to Overview
        </Button>
      </Link>
    </PageContainer>
  );
}
