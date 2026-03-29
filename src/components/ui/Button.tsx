import React from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'tonal' | 'elevated' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'filled', size = 'md', ...props }, ref) => {
    const variants = {
      filled: 'bg-primary text-on-primary shadow-sm hover:shadow-md active:scale-95',
      outlined: 'border border-outline text-primary hover:bg-primary/5 active:scale-95',
      tonal: 'bg-secondary-container text-on-secondary-container hover:shadow-sm active:scale-95',
      elevated: 'bg-surface text-primary shadow-md hover:shadow-lg active:scale-95',
      text: 'text-primary hover:bg-primary/5 active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-bold rounded-full',
      md: 'px-6 py-2.5 text-sm font-bold rounded-2xl',
      lg: 'px-8 py-4 text-base font-black rounded-3xl',
      icon: 'p-2 rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
