import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryAction?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-app-border rounded-lg bg-app-surface/50 max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-app-elevated flex items-center justify-center text-typography-muted mb-4 border border-app-border">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-typography-primary mb-1.5">{title}</h3>
      <p className="text-sm text-typography-secondary mb-6 leading-relaxed max-w-md">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && (
          actionHref ? (
            <a href={actionHref}>
              <Button variant="primary">{actionLabel}</Button>
            </a>
          ) : (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )
        )}
        {secondaryAction}
      </div>
    </div>
  );
};
