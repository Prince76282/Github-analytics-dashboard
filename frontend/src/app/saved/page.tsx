import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SavedRepositoryList } from '@/components/saved/SavedRepositoryList';

export default function SavedRepositoriesPage() {
  return (
    <PageContainer className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-typography-primary">
          Saved Repositories
        </h1>
        <p className="text-xs sm:text-sm text-typography-secondary mt-1">
          Your bookmarked repositories for quick access and reference.
        </p>
      </div>

      <SavedRepositoryList />
    </PageContainer>
  );
}
