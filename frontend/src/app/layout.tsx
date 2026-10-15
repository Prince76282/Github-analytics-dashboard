import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/components/feedback/ToastProvider';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'GITHUBRUPOCONTECTER',
  description:
    'Search GitHub repositories, inspect commits and contributors, and save your favourite repositories.',
  keywords: [
    'GITHUBRUPOCONTECTER',
    'GitHub',
    'Repository Explorer',
    'Developer Tools',
    'Next.js',
    'Express',
    'MongoDB',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
