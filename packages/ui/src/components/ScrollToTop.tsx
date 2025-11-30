'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/use-translation';

export function ScrollToTop() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={t('common.scrollToTop')}
      className={`
        fixed bottom-[175px] md:bottom-[165px] right-[20px] z-50
        p-4 rounded-full cursor-pointer
        bg-nord-10/90 dark:bg-nord-10/90 backdrop-blur-sm
        text-white dark:text-white
        shadow-[0_0_20px_rgba(94,129,172,0.5)] dark:shadow-[0_0_25px_rgba(136,192,208,0.4)]
        hover:bg-nord-10 dark:hover:bg-nord-10
        hover:shadow-[0_0_30px_rgba(94,129,172,0.7)] dark:hover:shadow-[0_0_35px_rgba(136,192,208,0.6)]
        hover:scale-110
        focus:outline-none focus:ring-4 focus:ring-nord-8 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-nord-0
        transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
