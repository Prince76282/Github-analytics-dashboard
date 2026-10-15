'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Select } from '@/components/ui/Select';

interface SortSelectorProps {
  value: 'stars' | 'updated';
  onChange: (sort: 'stars' | 'updated') => void;
  disabled?: boolean;
}

export const SortSelector: React.FC<SortSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-typography-secondary whitespace-nowrap flex items-center gap-1 font-medium">
        <ArrowUpDown className="w-3.5 h-3.5" />
        Sort:
      </span>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as 'stars' | 'updated')}
        disabled={disabled}
        options={[
          { value: 'stars', label: 'Most Stars' },
          { value: 'updated', label: 'Recently Updated' },
        ]}
      />
    </div>
  );
};
