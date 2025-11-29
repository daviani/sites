import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-[2.5rem] transition-all backdrop-blur-md';

  const variants = {
    default: 'bg-white/40 dark:bg-nord-3/50 shadow-lg hover:shadow-xl',
    elevated: 'bg-white/40 dark:bg-nord-3/50 shadow-xl hover:shadow-2xl',
    outlined: 'bg-white/40 dark:bg-nord-3/50 border-2 border-nord-4 dark:border-nord-3 hover:border-nord-10 dark:hover:border-nord-8'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
