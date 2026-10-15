import React from 'react';
import { cn } from '@/lib/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div className={cn('w-full max-w-canvas mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8', className)}>
      {children}
    </div>
  );
};
