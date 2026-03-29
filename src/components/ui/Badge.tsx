import React from 'react';
import { cn } from '@/src/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'filled' | 'outlined' | 'tonal';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export const Badge = ({ className, variant = 'tonal', size = 'md', ...props }: BadgeProps) => {
  const variants = {
    filled: 'bg-primary text-on-primary',
    outlined: 'border border-outline text-on-surface-variant',
    tonal: 'bg-secondary-container text-on-secondary-container',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md',
    md: 'px-3 py-1 text-xs font-bold rounded-full',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
