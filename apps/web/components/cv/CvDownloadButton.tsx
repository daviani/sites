'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@daviani/ui';

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

export function CvDownloadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Main button */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-nord-10/90 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(94,129,172,0.5)] backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-nord-10 hover:shadow-[0_0_30px_rgba(94,129,172,0.7)] focus:outline-none focus:ring-4 focus:ring-nord-8 focus:ring-offset-2 active:scale-100 dark:shadow-[0_0_25px_rgba(136,192,208,0.4)] dark:hover:shadow-[0_0_35px_rgba(136,192,208,0.6)]"
        >
          <DownloadIcon className="h-5 w-5" />
          {t('pages.cv.labels.download')}
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal content */}
          <div className="relative z-10 min-w-[300px] rounded-xl bg-white p-6 shadow-2xl dark:bg-nord-1">
            <h2
              id="download-modal-title"
              className="mb-4 text-lg font-semibold text-nord-0 dark:text-nord-6"
            >
              {t('pages.cv.labels.chooseFormat')}
            </h2>

            <div className="flex flex-col gap-3">
              {/* PDF Button */}
              <a
                href="/api/cv/pdf"
                download="Daviani-Fillatre-CV.pdf"
                className="cursor-pointer rounded-lg bg-nord-10 px-4 py-3 text-center font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-nord-9 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-nord-8 focus:ring-offset-2 dark:focus:ring-offset-nord-1"
                onClick={() => setIsOpen(false)}
              >
                {t('pages.cv.labels.downloadPdf')}
              </a>

              {/* DOCX Button */}
              <a
                href="/api/cv/docx"
                download="Daviani-Fillatre-CV.docx"
                className="cursor-pointer rounded-lg border-2 border-nord-3 bg-transparent px-4 py-3 text-center font-semibold text-nord-0 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-nord-3 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-nord-3 focus:ring-offset-2 dark:border-nord-4 dark:text-nord-6 dark:hover:bg-nord-4 dark:hover:text-nord-0 dark:focus:ring-offset-nord-1"
                onClick={() => setIsOpen(false)}
              >
                {t('pages.cv.labels.downloadDocx')}
              </a>

              {/* Cancel Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer px-4 py-2 text-center font-medium text-nord-11 transition-colors hover:text-nord-12 focus:outline-none"
              >
                {t('pages.cv.labels.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}