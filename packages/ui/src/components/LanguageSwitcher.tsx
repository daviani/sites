'use client';

import { useLanguage, Language } from '../hooks/use-language';
import { useTranslation } from '../hooks/use-translation';
import { FlagFR, FlagEN } from './icons/FlagIcons';

export function LanguageSwitcher() {
  const { language, setLanguage, mounted } = useLanguage();
  const { t } = useTranslation();

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <button
          className="rounded-full opacity-50 cursor-not-allowed"
          disabled
          aria-label="Loading..."
        >
          <FlagFR size={24} />
        </button>
      </div>
    );
  }

  const handleToggle = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  // Show the flag of the OTHER language (the one you can switch to)
  const Flag = language === 'fr' ? FlagEN : FlagFR;
  const nextLang: Language = language === 'fr' ? 'en' : 'fr';
  const ariaLabel =
    language === 'fr' ? t('common.english') : t('common.french');

  return (
    <button
      onClick={handleToggle}
      className="rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2 dark:focus:ring-offset-nord-0 cursor-pointer"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Flag size={24} />
    </button>
  );
}
