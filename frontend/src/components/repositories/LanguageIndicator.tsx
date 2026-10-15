import React from 'react';
import { cn } from '@/lib/cn';

interface LanguageIndicatorProps {
  language: string | null;
  className?: string;
}

// Curated colors for primary programming languages
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
};

export const LanguageIndicator: React.FC<LanguageIndicatorProps> = ({
  language,
  className,
}) => {
  if (!language) return null;

  const dotColor = LANGUAGE_COLORS[language] || '#8b949e';

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs text-typography-secondary', className)}>
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: dotColor }}
        aria-hidden="true"
      />
      <span className="font-medium">{language}</span>
    </div>
  );
};
