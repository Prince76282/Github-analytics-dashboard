'use client';

import React from 'react';
import { Palette, Check } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useTheme } from '@/providers/ThemeProvider';
import { ThemeId } from '@/config/themes';

export default function SettingsPage() {
  const { themeId, setThemeId, availableThemes } = useTheme();

  return (
    <PageContainer className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-typography-primary">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-typography-secondary mt-1">
          Customize your workspace visual theme and interface preferences.
        </p>
      </div>

      {/* Color Themes Selection */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-typography-secondary flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            Color Theme
          </h2>
          <p className="text-xs text-typography-muted mt-0.5">
            Choose your preferred color theme for the dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableThemes.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId(t.id as ThemeId)}
                className={`p-4 rounded-lg border text-left transition-all duration-150 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-app-surface'
                    : 'border-app-border bg-app-surface hover:border-typography-muted/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-typography-primary">
                      {t.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-typography-secondary mb-3">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-app-border/60">
                  <span
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: t.colors.bg }}
                    title="Background"
                  />
                  <span
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: t.colors.surface }}
                    title="Surface"
                  />
                  <span
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: t.colors.primary }}
                    title="Primary Accent"
                  />
                  <span
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: t.colors.textPrimary }}
                    title="Primary Text"
                  />
                  <span
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: t.colors.success }}
                    title="Success"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
}
