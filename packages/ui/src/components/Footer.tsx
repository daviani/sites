'use client';

interface FooterTranslations {
  legalNotice: string;
  github: string;
  linkedin: string;
  copyright: string;
  navigation: string;
  infos: string;
  links: string;
  sitemap?: string;
  help?: string;
  accessibility?: string;
}

interface FooterProps {
  legalUrl: string;
  accessibilityUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  sitemapUrl?: string;
  helpUrl?: string;
  translations: FooterTranslations;
}

export function Footer({
  legalUrl,
  accessibilityUrl,
  githubUrl,
  linkedinUrl,
  sitemapUrl,
  helpUrl,
  translations: t,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const linkStyles =
    'text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-8 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2';

  const mobileLinkStyles =
    'min-h-[44px] inline-flex items-center px-3 text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-8 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2';

  const titleStyles = 'font-semibold text-nord-0 dark:text-nord-6 mb-1';

  return (
    <footer className="mx-[var(--spacing-edge)] mb-[var(--spacing-edge)] glass-card py-3 md:py-4">
      <div className="container mx-auto px-4">
        {/* Mobile: Touch-friendly links */}
        <div className="md:hidden">
          <div className="flex flex-wrap items-center justify-center text-sm">
            <a href={legalUrl} className={mobileLinkStyles}>
              {t.legalNotice}
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={mobileLinkStyles}
            >
              {t.github}
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={mobileLinkStyles}
            >
              {t.linkedin}
            </a>
          </div>
          <div className="text-center text-xs text-nord-3 dark:text-nord-4">
            {t.copyright.replace('{year}', currentYear.toString())}
          </div>
        </div>

        {/* Desktop: 3 Columns */}
        <div className="hidden md:grid grid-cols-3 gap-4 text-sm text-center">
          {/* Column 1: Navigation */}
          <div className="flex flex-col items-center gap-1">
            <div className={titleStyles}>{t.navigation}</div>
            {sitemapUrl && t.sitemap && (
              <a href={sitemapUrl} className={linkStyles}>
                {t.sitemap}
              </a>
            )}
            {helpUrl && t.help && (
              <a href={helpUrl} className={linkStyles}>
                {t.help}
              </a>
            )}
          </div>

          {/* Column 2: Infos */}
          <div className="flex flex-col items-center gap-1">
            <div className={titleStyles}>{t.infos}</div>
            <a href={legalUrl} className={linkStyles}>
              {t.legalNotice}
            </a>
            <a href={accessibilityUrl} className={linkStyles}>
              {t.accessibility || 'Accessibility'}
            </a>
          </div>

          {/* Column 3: Links */}
          <div className="flex flex-col items-center gap-1">
            <div className={titleStyles}>{t.links}</div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {t.github}
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkStyles}
            >
              {t.linkedin}
            </a>
          </div>
        </div>

        {/* Desktop Copyright */}
        <div className="hidden md:block text-center text-xs text-nord-3 dark:text-nord-4 mt-3 pt-3 border-t border-nord-3 dark:border-nord-4">
          {t.copyright.replace('{year}', currentYear.toString())}
        </div>
      </div>
    </footer>
  );
}
