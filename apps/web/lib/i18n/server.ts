import { cookies } from 'next/headers';
import fr from '@daviani/ui/locales/fr';
import en from '@daviani/ui/locales/en';

export type Language = 'fr' | 'en';

const translations = { fr, en };

/**
 * Get the current language from cookies (server-side)
 */
export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('language');
  const lang = langCookie?.value;

  if (lang === 'fr' || lang === 'en') {
    return lang;
  }

  return 'fr'; // Default to French
}

/**
 * Get a translation value by key path (e.g., "pages.blog.title")
 */
export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return the key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get translations object for server components
 */
export async function getServerTranslations() {
  const lang = await getLanguage();

  return {
    lang,
    t: (key: string, params?: Record<string, string | number>) => {
      let text = getTranslation(lang, key);

      // Replace parameters like {current} and {total}
      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          text = text.replace(`{${paramKey}}`, String(paramValue));
        }
      }

      return text;
    },
  };
}