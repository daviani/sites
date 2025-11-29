'use client';

import { useTranslation } from '../hooks/use-translation';
import { GitHubIcon } from './icons/GitHubIcon';

interface FooterProps {
  legalUrl: string;
  contactUrl: string;
  githubUrl: string;
  accessibilityUrl?: string;
  sitemapUrl?: string;
  helpUrl?: string;
}

export function Footer({
  legalUrl,
  contactUrl,
  githubUrl,
  accessibilityUrl,
  sitemapUrl,
  helpUrl,
}: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const linkStyles =
    'text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-8 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2';

  const separator = (
    <span className="text-nord-4 dark:text-nord-3" aria-hidden="true">
      ·
    </span>
  );

  return (
    <footer className="mx-[10px] mb-[10px] shadow-lg backdrop-blur-md bg-white/40 dark:bg-nord-3/50 rounded-[2.5rem] py-4">
      <div className="container mx-auto px-4">
        {/* Line 1: Main Links */}
        <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
          <a href={legalUrl} className={linkStyles}>
            {t('footer.legal')}
          </a>
          {separator}
          <a href={contactUrl} className={linkStyles}>
            {t('footer.contact')}
          </a>
          {separator}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkStyles} flex items-center gap-1`}
            aria-label={t('footer.github')}
          >
            <GitHubIcon size={18} />
          </a>
        </div>

        {/* Line 2: Accessibility Links */}
        {(accessibilityUrl || sitemapUrl || helpUrl) && (
          <div className="flex items-center justify-center gap-4 text-sm mt-2 flex-wrap">
            {accessibilityUrl && (
              <>
                <a href={accessibilityUrl} className={linkStyles}>
                  {t('nav.accessibility.title')}
                </a>
                {(sitemapUrl || helpUrl) && separator}
              </>
            )}
            {sitemapUrl && (
              <>
                <a href={sitemapUrl} className={linkStyles}>
                  {t('nav.sitemap.title')}
                </a>
                {helpUrl && separator}
              </>
            )}
            {helpUrl && (
              <a href={helpUrl} className={linkStyles}>
                {t('nav.help.title')}
              </a>
            )}
          </div>
        )}

        {/* Line 3: Copyright */}
        <div className="text-center text-xs text-nord-3 dark:text-nord-4 mt-2">
          {t('footer.copyright').replace('{year}', currentYear.toString())}
        </div>
      </div>
    </footer>
  );
}
