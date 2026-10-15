import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { QuickSearch } from '@/components/dashboard/QuickSearch';
import { RecentSavedRepositories } from '@/components/dashboard/RecentSavedRepositories';

export default function HomePage() {
  return (
    <PageContainer className="space-y-8">
      <WelcomeSection />
      <QuickSearch />
      <RecentSavedRepositories />
    </PageContainer>
  );
}
