'use client';

import { useLanguage, Language } from '../hooks/use-language';
import { useTranslation } from '../hooks/use-translation';

export function LanguageSwitcher() {
  const { language, setLanguage, mounted } = useLanguage();
  const { t } = useTranslation();

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 text-sm">
        <button
          className="px-2 py-1 rounded text-nord-3 dark:text-nord-4"
          disabled
        >
          FR
        </button>
        <span className="text-nord-3 dark:text-nord-4">/</span>
        <button
          className="px-2 py-1 rounded text-nord-3 dark:text-nord-4"
          disabled
        >
          EN
        </button>
      </div>
    );
  }

  const buttonClass = (lang: Language) => {
    const isActive = language === lang;
    return `px-2 py-1 rounded text-sm font-medium transition-colors ${
      isActive
        ? 'bg-nord-10 text-nord-6'
        : 'text-nord-3 dark:text-nord-4 hover:bg-nord-5 dark:hover:bg-nord-2'
    }`;
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('common.languageSelection')}>
      <button
        onClick={() => setLanguage('fr')}
        className={buttonClass('fr')}
        aria-pressed={language === 'fr'}
        aria-label={t('common.french')}
      >
        FR
      </button>
      <span className="text-nord-3 dark:text-nord-4">/</span>
      <button
        onClick={() => setLanguage('en')}
        className={buttonClass('en')}
        aria-pressed={language === 'en'}
        aria-label={t('common.english')}
      >
        EN
      </button>
    </div>
  );
}
