'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizePixels = {
    xs: 20,
    sm: 28,
    md: 36,
    lg: 48,
  };

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initials = alt
    ? alt
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full border border-app-border bg-app-elevated shrink-0 font-medium text-typography-secondary',
        sizeClasses[size],
        className
      )}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          unoptimized
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-typography-muted" />
      )}
    </div>
  );
};
