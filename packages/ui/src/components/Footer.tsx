'use client';

import { useTranslation } from '../hooks/use-translation';

interface FooterProps {
  legalUrl: string;
  contactUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  accessibilityUrl?: string;
  sitemapUrl?: string;
  helpUrl?: string;
}

export function Footer({
  legalUrl,
  contactUrl,
  githubUrl,
  linkedinUrl,
  accessibilityUrl,
  sitemapUrl,
  helpUrl,
}: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const linkStyles =
    'text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-8 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2';

  const titleStyles = 'font-semibold text-nord-0 dark:text-nord-6 mb-1';

  const separatorStyles = 'text-nord-3 dark:text-nord-4';

  return (
    <footer className="fixed bottom-[10px] left-[10px] right-[10px] z-40 shadow-lg backdrop-blur-md bg-white/40 dark:bg-nord-3/50 rounded-[2.5rem] py-3 md:py-4">
      <div className="container mx-auto px-4">
        {/* Mobile: Compact single line */}
        <div className="md:hidden">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
            <a href={legalUrl} className={linkStyles}>
              {t('footer.legalNotice')}
            </a>
            <span className={separatorStyles} aria-hidden="true">•</span>
            <a href={contactUrl} className={linkStyles}>
              {t('footer.contact')}
            </a>
            <span className={separatorStyles} aria-hidden="true">•</span>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {t('footer.github')}
            </a>
            <span className={separatorStyles} aria-hidden="true">•</span>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {t('footer.linkedin')}
            </a>
          </div>
          <div className="text-center text-xs text-nord-3 dark:text-nord-4 mt-2">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </div>
        </div>

        {/* Desktop: 3 Columns */}
        <div className="hidden md:grid grid-cols-3 gap-4 text-sm text-center">
          {/* Column 1: Navigation */}
          <div className="flex flex-col items-center gap-1">
            <h3 className={titleStyles}>{t('footer.navigation')}</h3>
            {sitemapUrl && (
              <a href={sitemapUrl} className={linkStyles}>
                {t('nav.sitemap.title')}
              </a>
            )}
            {helpUrl && (
              <a href={helpUrl} className={linkStyles}>
                {t('nav.help.title')}
              </a>
            )}
          </div>

          {/* Column 2: Legal */}
          <div className="flex flex-col items-center gap-1">
            <h3 className={titleStyles}>{t('footer.legal')}</h3>
            <a href={legalUrl} className={linkStyles}>
              {t('footer.legalNotice')}
            </a>
            {accessibilityUrl && (
              <a href={accessibilityUrl} className={linkStyles}>
                {t('nav.accessibility.title')}
              </a>
            )}
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col items-center gap-1">
            <h3 className={titleStyles}>{t('footer.contact')}</h3>
            <a href={contactUrl} className={linkStyles}>
              {t('footer.contact')}
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {t('footer.github')}
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {t('footer.linkedin')}
            </a>
          </div>
        </div>

        {/* Desktop Copyright */}
        <div className="hidden md:block text-center text-xs text-nord-3 dark:text-nord-4 mt-3 pt-3 border-t border-nord-4/30 dark:border-nord-2/30">
          {t('footer.copyright').replace('{year}', currentYear.toString())}
        </div>
      </div>
    </footer>
  );
}
