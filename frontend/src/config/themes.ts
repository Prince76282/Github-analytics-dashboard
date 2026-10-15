export type ThemeId = 'editorial' | 'forest' | 'terracotta' | 'midnight';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  isDark?: boolean;
  colors: {
    bg: string;
    surface: string;
    elevated: string;
    border: string;
    borderSubtle: string;
    primary: string;
    primaryHover: string;
    primarySoft: string;
    primaryForeground: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial Cobalt',
    description: 'Graphite typography, warm surfaces, and precise cobalt accents',
    colors: {
      bg: '#F5F5F0',
      surface: '#FFFFFF',
      elevated: '#FAFAFA',
      border: '#DFE3DC',
      borderSubtle: '#ECEFEA',
      primary: '#3157A4',
      primaryHover: '#254582',
      primarySoft: '#E8EDF8',
      primaryForeground: '#FFFFFF',
      textPrimary: '#202622',
      textSecondary: '#69716B',
      textMuted: '#8E9690',
      success: '#267653',
      warning: '#A46A18',
      error: '#B74343',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest Parchment',
    description: 'Understated engineering notebook with calm olive and forest tones',
    colors: {
      bg: '#F3F4EC',
      surface: '#FFFFFF',
      elevated: '#F9FBF8',
      border: '#DDE2D6',
      borderSubtle: '#EBEEE6',
      primary: '#356B4D',
      primaryHover: '#28553C',
      primarySoft: '#E6EEE5',
      primaryForeground: '#FFFFFF',
      textPrimary: '#242D25',
      textSecondary: '#6B766B',
      textMuted: '#939D93',
      success: '#356B4D',
      warning: '#9A6B25',
      error: '#A84742',
    },
  },
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta & Ink',
    description: 'Warm editorial workspace with terracotta accents and rich ink contrast',
    colors: {
      bg: '#F7F2EC',
      surface: '#FFFFFF',
      elevated: '#FCFAF8',
      border: '#E7DDD3',
      borderSubtle: '#F0E8E1',
      primary: '#B45136',
      primaryHover: '#913E2A',
      primarySoft: '#F5E6DF',
      primaryForeground: '#FFFFFF',
      textPrimary: '#292623',
      textSecondary: '#776F68',
      textMuted: '#9D958E',
      success: '#377A61',
      warning: '#9C6A24',
      error: '#B13D42',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Slate',
    description: 'Restrained dark developer workspace with high contrast ice blue accents',
    isDark: true,
    colors: {
      bg: '#151B22',
      surface: '#1D252E',
      elevated: '#252F3A',
      border: '#35414E',
      borderSubtle: '#28323D',
      primary: '#79A9E8',
      primaryHover: '#9ABEF0',
      primarySoft: '#263A50',
      primaryForeground: '#0D1117',
      textPrimary: '#E8EDF2',
      textSecondary: '#9AA8B5',
      textMuted: '#738290',
      success: '#75C8A0',
      warning: '#E7BA70',
      error: '#F08B88',
    },
  },
};

export const DEFAULT_THEME_ID: ThemeId = 'editorial';
