import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-nord10 dark:bg-nord9 text-white hover:bg-nord9 dark:hover:bg-nord8 focus:ring-nord10 dark:focus:ring-nord8',
    secondary: 'bg-nord8 dark:bg-nord7 text-white hover:bg-nord7 dark:hover:bg-nord8 focus:ring-nord8 dark:focus:ring-nord7',
    outline: 'border-2 border-nord10 dark:border-nord8 text-nord10 dark:text-nord8 hover:bg-nord10 dark:hover:bg-nord8 hover:text-white focus:ring-nord10 dark:focus:ring-nord8',
    ghost: 'text-nord10 dark:text-nord8 hover:bg-nord10/10 dark:hover:bg-nord8/10 focus:ring-nord10 dark:focus:ring-nord8'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
