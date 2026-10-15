import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const variants = {
    default: 'bg-app-elevated border border-app-border text-typography-secondary',
    primary: 'bg-primary-soft text-primary border border-primary/20',
    success: 'bg-status-success/15 text-status-success border border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border border-status-warning/30',
    outline: 'border border-app-border text-typography-primary',
    subtle: 'bg-app-bg text-typography-muted',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
