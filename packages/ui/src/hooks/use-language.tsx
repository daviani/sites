'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_COOKIE_NAME = 'language';

function getCookieDomain(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;

  if (hostname === 'localhost') {
    return '';
  }

  if (hostname.endsWith('.localhost')) {
    return 'localhost';
  }

  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return '.' + parts.slice(-2).join('.');
  }

  return '';
}

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
  const domain = getCookieDomain();
  const maxAge = 365 * 24 * 60 * 60; // 1 an
  let cookieStr = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${maxAge}; SameSite=Lax`;
  if (domain) {
    cookieStr += `; domain=${domain}`;
  }
  document.cookie = cookieStr;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLanguage = getStoredLanguage();
    const browserLanguage = navigator.language.startsWith('fr') ? 'fr' : 'en';
    const initialLanguage = storedLanguage || browserLanguage;
    setLanguageState(initialLanguage);
    document.documentElement.lang = initialLanguage;
  }, []);

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
