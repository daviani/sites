'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface UseRecaptchaOptions {
  loadOnMount?: boolean;
}

interface UseRecaptchaReturn {
  execute: (action: string) => Promise<string>;
  load: () => void;
  isLoaded: boolean;
  isLoading: boolean;
}

export function useRecaptcha(
  options: UseRecaptchaOptions = {}
): UseRecaptchaReturn {
  const { loadOnMount = false } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadPromiseRef = useRef<Promise<void> | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  const load = useCallback(() => {
    // Return existing promise if already loading
    if (loadPromiseRef.current) {
      return loadPromiseRef.current;
    }

    // Already loaded
    if (isLoaded) {
      return Promise.resolve();
    }

    setIsLoading(true);

    loadPromiseRef.current = new Promise<void>((resolve) => {
      // Check if script already exists
      if (document.querySelector('script[src*="recaptcha"]')) {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            setIsLoaded(true);
            setIsLoading(false);
            resolve();
          });
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
          setIsLoading(false);
          resolve();
        });
      };

      document.head.appendChild(script);
    });

    return loadPromiseRef.current;
  }, [isLoaded, siteKey]);

  useEffect(() => {
    if (loadOnMount) {
      load();
    }
  }, [loadOnMount, load]);

  const execute = useCallback(
    async (action: string): Promise<string> => {
      // Auto-load if not already loaded
      if (!isLoaded) {
        await load();
      }

      if (!window.grecaptcha) {
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
    [isLoaded, load, siteKey]
  );

  return { execute, load, isLoaded, isLoading };
}
