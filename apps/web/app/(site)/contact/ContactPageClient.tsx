'use client';

import type { ReactNode } from 'react';
import { Breadcrumb } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';
import { ContactForm } from '@/components/ContactForm';
import { submitContactForm } from './actions';

const ICONS: Record<string, ReactNode> = {
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18.3H5.7V9.7h2.6zM7 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11.3 9.8h-2.6v-4.2c0-1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1-.1.2-.1.4-.1.7v4.2h-2.6V9.7h2.6v1.1c.3-.5 1-1.3 2.4-1.3 1.7 0 3 1.1 3 3.5z" />
    </svg>
  ),
  location: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
};

interface Method {
  key: 'email' | 'github' | 'linkedin' | 'location';
  value: string;
  href: string | null;
}

const METHODS: Method[] = [
  { key: 'email', value: 'hello@daviani.dev', href: 'mailto:hello@daviani.dev' },
  { key: 'github', value: '@daviani', href: 'https://github.com/daviani' },
  { key: 'linkedin', value: 'Daviani Fillatre', href: 'https://linkedin.com/in/daviani' },
  { key: 'location', value: '', href: null },
];

export default function ContactPageClient() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumb
          items={[{ href: '/contact', label: t('nav.contact.title') }]}
          homeLabel={t('common.home')}
          ariaLabel={t('common.breadcrumb')}
        />

        <div className="text-center pt-[54px] pb-9">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
            {t('contact.eyebrow')}
          </span>
          <h1 className="text-[clamp(40px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
            {t('pages.contact.title')}
          </h1>
          <p className="text-[17px] text-fg-muted mt-3.5 max-w-[54ch] mx-auto">
            {t('contact.intro')}
          </p>
        </div>

        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-7 items-start">
          <ContactForm onSubmit={submitContactForm} />

          <aside className="flex flex-col gap-4">
            {/* Disponibilité */}
            <div className="bg-surface border border-surface-hi/55 rounded-2xl px-6 py-[22px]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-ok ring-4 ring-ok/20 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-[15px] font-semibold text-fg">{t('contact.aside.availableTitle')}</div>
                  <div className="text-[13px] text-fg-muted">{t('contact.aside.availableSub')}</div>
                </div>
              </div>
            </div>

            {/* En direct */}
            <div className="bg-surface border border-surface-hi/55 rounded-2xl px-6 py-[22px]">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-fg-subtle mb-3">
                {t('contact.aside.directTitle')}
              </h3>
              {METHODS.map((m, i) => {
                const value = m.key === 'location' ? t('contact.aside.locationValue') : m.value;
                const isExternal = !!m.href && m.href.startsWith('http');
                // Classes en littéraux statiques : Tailwind scanne le source par tokens
                // séparés par espaces — une classe collée à `${}` ne serait pas générée.
                const rowBase = 'flex items-center gap-3.5 py-3';
                const rowClass = i > 0 ? `${rowBase} border-t border-surface-hi/40` : rowBase;
                const inner = (
                  <>
                    <span className="w-[38px] h-[38px] rounded-xl bg-surface-el border border-surface-hi/55 flex items-center justify-center text-accent shrink-0">
                      {ICONS[m.key]}
                    </span>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.06em] text-fg-subtle">
                        {t(`contact.aside.${m.key}`)}
                      </div>
                      <div className="text-[15px] font-medium text-fg transition-colors group-hover:text-accent">{value}</div>
                    </div>
                  </>
                );
                return m.href ? (
                  <a
                    key={m.key}
                    href={m.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={`${rowClass} group`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={m.key} className={rowClass}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        <p className="text-center text-sm text-fg-muted mt-8">{t('contact.fallback')}</p>
      </div>
    </div>
  );
}
