'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ children, className = '', disabled, ...props }: IconButtonProps) {
  const baseStyles =
    'p-2 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-bg';

  const interactiveStyles = 'hover:scale-105 hover:bg-surface-hi';
  const disabledStyles = 'opacity-50 cursor-default';

  return (
    <button
      className={`${baseStyles} ${disabled ? disabledStyles : interactiveStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
