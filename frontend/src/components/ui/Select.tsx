import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-typography-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-9 appearance-none rounded border border-app-border bg-app-surface pl-3 pr-8 text-sm text-typography-primary transition-colors cursor-pointer',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              error ? 'border-status-error' : '',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="absolute right-2.5 w-4 h-4 text-typography-muted pointer-events-none" />
        </div>
        {error && <span className="text-xs text-status-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
