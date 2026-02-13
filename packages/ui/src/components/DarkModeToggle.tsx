'use client';

import { useTheme } from '../hooks/use-theme';
import { IconButton } from './IconButton';

interface DarkModeToggleProps {
  labels: {
    switchToDark: string;
    switchToLight: string;
  };
}

export function DarkModeToggle({ labels }: DarkModeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <IconButton
        className="text-nord-3 dark:text-nord-4"
        aria-label={labels.switchToDark}
        disabled
      >
        <span className="w-6 h-6 block" />
      </IconButton>
    );
  }

  const label = theme === 'light' ? labels.switchToDark : labels.switchToLight;

  return (
    <IconButton
      onClick={toggleTheme}
      className="text-nord-3 dark:text-nord-8"
      aria-label={label}
      title={label}
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
    </IconButton>
  );
}
