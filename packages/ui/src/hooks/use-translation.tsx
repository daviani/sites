'use client';

import { useLanguage, Language } from './use-language';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

type Translations = typeof fr;

const translations: Record<Language, Translations> = {
  fr,
  en,
};

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<Translations>;

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const { language, mounted } = useLanguage();

  const t = (key: TranslationKey): string => {
    if (!mounted) {
      return getNestedValue(translations.fr, key);
    }
    return getNestedValue(translations[language], key);
  };

  return { t, language, mounted };
}
