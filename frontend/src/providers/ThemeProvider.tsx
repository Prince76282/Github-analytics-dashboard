'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, DEFAULT_THEME_ID, ThemeId, ThemeConfig } from '@/config/themes';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'github-analytics-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (stored && THEMES[stored]) {
        setThemeIdState(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
    setMounted(true);
  }, []);

  const setThemeId = (id: ThemeId) => {
    if (!THEMES[id]) return;
    setThemeIdState(id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // Ignore
    }
  };

  const currentTheme = THEMES[themeId] || THEMES[DEFAULT_THEME_ID];

  // Apply CSS variables to root
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const colors = currentTheme.colors;

    root.style.setProperty('--color-bg', colors.bg);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-elevated', colors.elevated);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-border-subtle', colors.borderSubtle);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primary-soft', colors.primarySoft);
    root.style.setProperty('--color-primary-foreground', colors.primaryForeground);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);

    if (currentTheme.isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'midnight');
    } else {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme: currentTheme,
        setThemeId,
        availableThemes: Object.values(THEMES),
      }}
    >
      <div style={{ visibility: mounted ? 'visible' : 'visible' }}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
