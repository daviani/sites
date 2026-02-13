'use client';

import { useLanguage } from '../hooks/use-language';
import { useTranslation } from '../hooks/use-translation';
import { FlagFR, FlagEN } from './icons/FlagIcons';
import { IconButton } from './IconButton';

export function LanguageSwitcher() {
  const { language, setLanguage, mounted } = useLanguage();
  const { t } = useTranslation();

  if (!mounted) {
    return (
      <IconButton disabled aria-label="Loading...">
        <FlagFR size={24} />
      </IconButton>
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
    <IconButton
      onClick={handleToggle}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Flag size={24} />
    </IconButton>
  );
}
