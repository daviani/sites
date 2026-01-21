'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { OwlLogo } from './OwlLogo';
import { useTranslation, TranslationKey } from '../hooks/use-translation';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
}

export interface HeaderProps {
  logo?: ReactNode;
  className?: string;
  homeUrl?: string;
  navItems?: NavItem[];
  secondaryNavItems?: NavItem[];
  currentPath?: string;
}

export function Header({ logo, className = '', homeUrl = '/', navItems = [], secondaryNavItems = [], currentPath = '' }: HeaderProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const baseStyles =
    'px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2';
  const inactiveStyles =
    'text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-6 hover:bg-nord-5 dark:hover:bg-nord-2';
  const activeStyles =
    'text-nord-0 dark:text-nord-6 bg-nord-5 dark:bg-nord-2';

  return (
    <header
      ref={headerRef}
      className={`fixed top-[10px] left-[10px] right-[10px] z-50 shadow-lg backdrop-blur-md bg-white/40 dark:bg-nord-3/50 rounded-[2.5rem] transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Branding */}
          <div className="flex-shrink-0">
            {logo || (
              <a href={homeUrl} aria-label="Daviani.dev - Retour à l'accueil" className="flex items-center gap-3 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-lg text-nord-3 dark:text-nord-4 hover:bg-nord-5 dark:hover:bg-nord-2 focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2 transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? t('common.closeMenu') : t('common.openMenu')}
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden pb-4">
            {/* Navigation Links */}
            {navItems.length > 0 && (
              <ul className="flex flex-col items-center gap-1">
                {navItems.map((item) => {
                  const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href} className="w-full">
                      <a
                        href={item.href}
                        className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles} block text-center`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {t(item.labelKey)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Secondary Navigation Links (Accessibility, Sitemap, Help) */}
            {secondaryNavItems.length > 0 && (
              <ul className="flex flex-col items-center gap-1 mt-2 pt-2 border-t border-nord-3/30 dark:border-nord-4/30">
                {secondaryNavItems.map((item) => {
                  const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href} className="w-full">
                      <a
                        href={item.href}
                        className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles} block text-center text-xs`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {t(item.labelKey)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Theme & Language toggles */}
            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-nord-3/30 dark:border-nord-4/30">
              <LanguageSwitcher />
              <DarkModeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
