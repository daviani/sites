'use client';

import { useLanguage, Language } from '../hooks/use-language';
import { useTranslation } from '../hooks/use-translation';
import { FlagFR, FlagEN } from './icons/FlagIcons';

export function LanguageSwitcher() {
  const { language, setLanguage, mounted } = useLanguage();
  const { t } = useTranslation();

  // Common button styles for consistency with DarkModeToggle
  const buttonStyles =
    'p-2 rounded-full transition-all hover:scale-105 hover:bg-nord-5 dark:hover:bg-nord-2 focus:outline-none focus:ring-2 focus:ring-nord-8 focus:ring-offset-2 dark:focus:ring-offset-nord-0 cursor-pointer';

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full opacity-50"
        disabled
        aria-label="Loading..."
      >
        <FlagFR size={24} />
      </button>
    );
  }

  const handleToggle = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  // Show the flag of the OTHER language (the one you can switch to)
  const Flag = language === 'fr' ? FlagEN : FlagFR;
  const ariaLabel =
    language === 'fr' ? t('common.english') : t('common.french');

  return (
    <button
      onClick={handleToggle}
      className={buttonStyles}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Flag size={24} />
    </button>
  );
}
