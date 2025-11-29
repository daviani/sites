'use client';

import { useTheme } from '../hooks/use-theme';
import { useTranslation } from '../hooks/use-translation';

export function DarkModeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useTranslation();

  // Common button styles for consistency with LanguageSwitcher
  const buttonStyles =
    'p-2 rounded-full transition-all hover:scale-105 hover:bg-nord-5 dark:hover:bg-nord-2 focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2 dark:focus:ring-offset-nord-0 cursor-pointer';

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full text-nord-3 dark:text-nord-4 opacity-50"
        aria-label={t('darkMode.switchToDark')}
        disabled
      >
        <span className="w-6 h-6 block" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${buttonStyles} text-nord-3 dark:text-nord-8`}
      aria-label={theme === 'light' ? t('darkMode.switchToDark') : t('darkMode.switchToLight')}
      title={theme === 'light' ? t('darkMode.switchToDark') : t('darkMode.switchToLight')}
    >
      {theme === 'light' ? (
        // Moon icon for dark mode
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}
