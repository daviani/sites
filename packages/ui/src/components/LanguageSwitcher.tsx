'use client';

import type { Language } from '../hooks/use-language';
import { FlagFR, FlagEN } from './icons/FlagIcons';
import { IconButton } from './IconButton';

interface LanguageSwitcherProps {
  language: Language;
  mounted: boolean;
  onToggle: () => void;
  labels: {
    switchToEnglish: string;
    switchToFrench: string;
  };
}

export function LanguageSwitcher({ language, mounted, onToggle, labels }: LanguageSwitcherProps) {
  if (!mounted) {
    return (
      <IconButton disabled aria-label="Loading...">
        <FlagFR size={24} />
      </IconButton>
    );
  }

  // Show the flag of the OTHER language (the one you can switch to)
  const Flag = language === 'fr' ? FlagEN : FlagFR;
  const ariaLabel =
    language === 'fr' ? labels.switchToEnglish : labels.switchToFrench;

  return (
    <IconButton
      onClick={onToggle}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Flag size={24} />
    </IconButton>
  );
}
