'use client';

import { useTranslation } from '@/hooks/use-translation';

export function RssButton() {
  const { t } = useTranslation();

  return (
    <a
      href="/api/rss"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-surface-hi/55 font-mono text-[13px] font-medium text-fg-muted hover:text-accent hover:border-accent/40 hover:bg-[color-mix(in_oklab,var(--tuli-accent)_12%,transparent)] transition-colors"
      title={t('rss.title')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M3.75 3a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75H4c6.075 0 11 4.925 11 11v.25c0 .414.336.75.75.75h.5a.75.75 0 0 0 .75-.75V16C17 8.82 11.18 3 4 3h-.25Z" />
        <path d="M3 8.75A.75.75 0 0 1 3.75 8H4a8 8 0 0 1 8 8v.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V16a6 6 0 0 0-6-6h-.25A.75.75 0 0 1 3 9.25v-.5Z" />
        <path d="M7 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
      </svg>
      {t('rss.subscribe')}
    </a>
  );
}