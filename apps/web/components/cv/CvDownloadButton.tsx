'use client';

import { useState } from 'react';
import { useTranslation } from '@nordic-island/ui';

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function CvDownloadButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useTranslation();

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        theme: 'light',
        lang: language,
        action: 'download',
      });

      const response = await fetch(`/api/cv/pdf?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = language === 'fr' ? 'Daviani-Fillatre-CV.pdf' : 'Daviani-Fillatre-Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-nord-btn/90 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(74,111,165,0.5)] backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-nord-btn hover:shadow-[0_0_30px_rgba(74,111,165,0.7)] focus:outline-none focus:ring-4 focus:ring-nord-8 focus:ring-offset-2 active:scale-100 disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100 dark:shadow-[0_0_25px_rgba(136,192,208,0.4)] dark:hover:shadow-[0_0_35px_rgba(136,192,208,0.6)]"
      >
        {isLoading ? (
          <LoadingSpinner className="h-5 w-5" />
        ) : (
          <DownloadIcon className="h-5 w-5" />
        )}
        {t('pages.cv.labels.download')}
      </button>
    </div>
  );
}