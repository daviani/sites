'use client';

import { Breadcrumb, useTheme } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';

// Aperçus image (theme-aware) + téléchargement du PDF réel. Pas d'ATS public (verrouillé).
// Images générées depuis les PDF (pdftoppm 200dpi → cwebp). CV = 2 pages A4 (1653×2339).
const ASSETS = {
  dark: {
    pdf: '/cv/Daviani-Fillatre-CV.pdf', // Kaamos
    pages: ['/cv/cv-dark-1.webp', '/cv/cv-dark-2.webp'],
  },
  light: {
    pdf: '/cv/Daviani-Fillatre-CV-light.pdf', // Päivä
    pages: ['/cv/cv-light-1.webp', '/cv/cv-light-2.webp'],
  },
};

export default function CvPageClient() {
  const { t } = useTranslation();
  const { theme, mounted } = useTheme();
  // SSR + premier rendu : Päivä (clair). Bascule en Kaamos une fois monté.
  const isDark = mounted && theme === 'dark';
  const { pdf, pages } = isDark ? ASSETS.dark : ASSETS.light;
  // L'autre version, téléchargeable directement sans changer le thème du site.
  const otherPdf = isDark ? ASSETS.light.pdf : ASSETS.dark.pdf;

  return (
    <div className="min-h-screen">
      <div className="w-[var(--content-width)] mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb
            items={[{ href: '/cv', label: t('nav.cv.title') }]}
            homeLabel={t('common.home')}
            ariaLabel={t('common.breadcrumb')}
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-fg">{t('cv.title')}</h1>
          <p className="text-xl text-fg-muted">{t('cv.subtitle')}</p>
        </div>

        <div className="flex flex-col items-center gap-3 mb-8">
          <a
            href={pdf}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium bg-accent text-on-accent hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            {t('cv.download')}
          </a>

          <a
            href={otherPdf}
            download
            className="text-sm text-fg-muted hover:text-accent underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
          >
            {isDark ? t('cv.downloadLight') : t('cv.downloadDark')}
          </a>
        </div>

        <div className="flex flex-col items-center gap-6">
          {pages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`${t('cv.title')} — ${i + 1}/${pages.length}`}
              width={1653}
              height={2339}
              loading={i === 0 ? 'eager' : 'lazy'}
              suppressHydrationWarning
              className="w-full rounded-[var(--radius-island)] border border-surface-hi shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
