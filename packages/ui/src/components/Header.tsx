'use client';

import { ReactNode } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface HeaderProps {
  children?: ReactNode;
  logo?: ReactNode;
  className?: string;
}

export function Header({ children, logo, className = '' }: HeaderProps) {
  return (
    <header
      className={`w-full border-b border-nord-4 dark:border-nord-3 bg-nord-6 dark:bg-nord-0 transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex-shrink-0">
            {logo || (
              <span className="text-xl font-bold text-nord-10">
                daviani.dev
              </span>
            )}
          </div>

          {/* Actions (LanguageSwitcher, DarkModeToggle, Navigation, etc.) */}
          <div className="flex items-center gap-4">
            {children}
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
