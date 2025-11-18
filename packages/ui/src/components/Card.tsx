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
  const baseStyles = 'rounded-xl transition-all';

  const variants = {
    default: 'bg-white dark:bg-nord1 shadow-md hover:shadow-lg',
    elevated: 'bg-white dark:bg-nord1 shadow-lg hover:shadow-2xl',
    outlined: 'bg-white dark:bg-nord1 border-2 border-nord4 dark:border-nord3 hover:border-nord10'
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
