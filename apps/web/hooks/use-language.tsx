'use client';

import { createContext, useContext, useEffect, useSyncExternalStore, useState, ReactNode, useCallback } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_COOKIE_NAME = 'language';

function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === LANGUAGE_COOKIE_NAME && (value === 'fr' || value === 'en')) {
      return value as Language;
    }
  }
  return null;
}

function setLanguageCookie(lang: Language) {
  const maxAge = 365 * 24 * 60 * 60; // 1 an
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'fr';
  const stored = getStoredLanguage();
  if (stored) return stored;
  return navigator.language.startsWith('fr') ? 'fr' : 'en';
}

// useSyncExternalStore for hydration-safe mounted detection (no setState in effect)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    setLanguageCookie(newLanguage);
    document.documentElement.lang = newLanguage;
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLanguage);
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
