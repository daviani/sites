'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface UseRecaptchaReturn {
  execute: (action: string) => Promise<string>;
  isLoaded: boolean;
}

export function useRecaptcha(): UseRecaptchaReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="recaptcha"]')) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setIsLoaded(true));
      }
      return;
    }

    // Load ReCaptcha script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup is optional for ReCaptcha
    };
  }, [siteKey]);

  const execute = useCallback(
    async (action: string): Promise<string> => {
      if (!isLoaded || !window.grecaptcha) {
        throw new Error('ReCaptcha not loaded');
      }

      try {
        const token = await window.grecaptcha.execute(siteKey, { action });
        return token;
      } catch (error) {
        console.error('ReCaptcha execution failed:', error);
        throw error;
      }
    },
    [isLoaded, siteKey]
  );

  return { execute, isLoaded };
}
