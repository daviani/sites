'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ children, className = '', disabled, ...props }: IconButtonProps) {
  const baseStyles =
    'p-2 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2 dark:focus:ring-offset-nord-0';

  const interactiveStyles = 'hover:scale-105 hover:bg-nord-5 dark:hover:bg-nord-2';
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
