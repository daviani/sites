import type { Metadata } from 'next';
import { Breadcrumb } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';
import type { TranslationKey } from '@/hooks/use-translation';

export const metadata: Metadata = {
  title: 'Aide à la navigation',
};

const CARD = 'bg-surface border border-surface-hi/55 rounded-2xl p-6 md:p-8';

const helpSections: { titleKey: TranslationKey; textKey: TranslationKey; icon: string }[] = [
  { titleKey: 'pages.help.keyboard', textKey: 'pages.help.keyboardText', icon: '⌨️' },
  { titleKey: 'pages.help.skipLink', textKey: 'pages.help.skipLinkText', icon: '⏭️' },
  { titleKey: 'pages.help.theme', textKey: 'pages.help.themeText', icon: '🌙' },
  { titleKey: 'pages.help.language', textKey: 'pages.help.languageText', icon: '🌐' },
];

const SHORTCUTS: { keys: string; labelKey: TranslationKey }[] = [
  { keys: 'Tab', labelKey: 'pages.help.shortcuts.next' },
  { keys: 'Shift + Tab', labelKey: 'pages.help.shortcuts.previous' },
  { keys: 'Enter', labelKey: 'pages.help.shortcuts.activate' },
  { keys: 'Escape', labelKey: 'pages.help.shortcuts.close' },
];

export default async function HelpPage() {
  const { t } = await getServerTranslations();

  return (
    <div>
      <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumb
          items={[{ href: '/help', label: t('nav.help.title') }]}
          homeLabel={t('common.home')}
          ariaLabel={t('common.breadcrumb')}
        />

        <div className="text-center pt-[54px] pb-9">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
            {t('pages.help.eyebrow')}
          </span>
          <h1 className="text-[clamp(40px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
            {t('pages.help.title')}
          </h1>
          <p className="text-[17px] text-fg-muted mt-3.5 max-w-[54ch] mx-auto">
            {t('pages.help.subtitle')}
          </p>
        </div>

        <div className="space-y-5 max-w-4xl mx-auto">
          {helpSections.map((section) => (
            <section key={section.titleKey} className={CARD}>
              <h2 className="text-xl font-bold mb-3 text-accent flex items-center gap-3">
                <span aria-hidden="true">{section.icon}</span>
                {t(section.titleKey)}
              </h2>
              <p className="text-fg-muted leading-relaxed">{t(section.textKey)}</p>
            </section>
          ))}

          {/* Raccourcis clavier */}
          <section className={CARD}>
            <h2 className="text-xl font-bold mb-4 text-fg">{t('pages.help.shortcuts.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHORTCUTS.map((s) => (
                <div key={s.keys} className="flex items-center gap-3 text-fg-muted">
                  <kbd className="px-3 py-1 bg-surface-el rounded-lg border border-surface-hi/55 font-mono text-sm text-fg">
                    {s.keys}
                  </kbd>
                  <span className="text-fire" aria-hidden="true">→</span>
                  <span>{t(s.labelKey)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
