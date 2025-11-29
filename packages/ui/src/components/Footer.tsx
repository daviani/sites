'use client';

import { useTranslation } from '../hooks/use-translation';
import { GitHubIcon } from './icons/GitHubIcon';

interface FooterProps {
  legalUrl: string;
  contactUrl: string;
  githubUrl: string;
}

export function Footer({ legalUrl, contactUrl, githubUrl }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const linkStyles =
    'text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-8 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-nord-10 focus:ring-offset-2';

  return (
    <footer className="mx-[10px] mb-[10px] shadow-lg backdrop-blur-md bg-white/40 dark:bg-nord-3/50 rounded-[2.5rem] py-4">
      <div className="container mx-auto px-4">
        {/* Line 1: Links */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <a href={legalUrl} className={linkStyles}>
            {t('footer.legal')}
          </a>
          <span className="text-nord-4 dark:text-nord-3" aria-hidden="true">
            ·
          </span>
          <a href={contactUrl} className={linkStyles}>
            {t('footer.contact')}
          </a>
          <span className="text-nord-4 dark:text-nord-3" aria-hidden="true">
            ·
          </span>
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

        {/* Line 2: Copyright */}
        <div className="text-center text-xs text-nord-3 dark:text-nord-4 mt-2">
          {t('footer.copyright').replace('{year}', currentYear.toString())}
        </div>
      </div>
    </footer>
  );
}
