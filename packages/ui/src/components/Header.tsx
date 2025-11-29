'use client';

import { ReactNode } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { OwlLogo } from './OwlLogo';

export interface HeaderProps {
  logo?: ReactNode;
  className?: string;
  homeUrl?: string;
}

export function Header({ logo, className = '', homeUrl = '/' }: HeaderProps) {
  return (
    <header
      className={`fixed top-[10px] left-[10px] right-[10px] z-50 shadow-lg backdrop-blur-md bg-white/40 dark:bg-nord-3/50 rounded-[2.5rem] transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex-shrink-0">
            {logo || (
              <a href={homeUrl} aria-label="Retour à l'accueil" className="flex items-center gap-3 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-nord-8 focus:ring-offset-2">
                <OwlLogo size={48} />
                <span className="text-xl font-mono font-bold">
                  <span className="text-nord-3 dark:text-nord-4">&lt;</span>
                  <span className="text-nord-10 dark:text-nord-8">Daviani</span>
                  <span className="text-nord-3 dark:text-nord-4">.</span>
                  <span className="text-nord-9 dark:text-nord-7">dev</span>
                  <span className="text-nord-3 dark:text-nord-4">/&gt;</span>
                </span>
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
