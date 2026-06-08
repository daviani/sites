'use client';

import { Breadcrumb } from '@tulikettu/ui';
import { useTranslation, type TranslationKey } from '@/hooks/use-translation';

export default function HelpPage() {
  const { t } = useTranslation();

  const helpSections: { titleKey: TranslationKey; textKey: TranslationKey; icon: string }[] = [
    {
      titleKey: 'pages.help.keyboard',
      textKey: 'pages.help.keyboardText',
      icon: '⌨️',
    },
    {
      titleKey: 'pages.help.skipLink',
      textKey: 'pages.help.skipLinkText',
      icon: '⏭️',
    },
    {
      titleKey: 'pages.help.theme',
      textKey: 'pages.help.themeText',
      icon: '🌙',
    },
    {
      titleKey: 'pages.help.language',
      textKey: 'pages.help.languageText',
      icon: '🌐',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="w-[var(--content-width)] mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/help', label: t('nav.help.title') }]} homeLabel={t('common.home')} ariaLabel={t('common.breadcrumb')} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-fg">
            {t('pages.help.title')}
          </h1>
          <p className="text-xl text-fg dark:text-fg-muted">
            {t('pages.help.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {helpSections.map((section, index) => (
            <section
              key={index}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-accent flex items-center gap-3">
                <span aria-hidden="true">{section.icon}</span>
                {t(section.titleKey)}
              </h2>
              <p className="text-fg dark:text-fg-muted leading-relaxed">
                {t(section.textKey)}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-surface-hi rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-fg">
            {t('pages.help.keyboard')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-fg dark:text-fg-muted">
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-surface rounded border border-surface-hi font-mono text-sm">
                Tab
              </kbd>
              <span>→ Next element</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-surface rounded border border-surface-hi font-mono text-sm">
                Shift + Tab
              </kbd>
              <span>→ Previous element</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-surface rounded border border-surface-hi font-mono text-sm">
                Enter
              </kbd>
              <span>→ Activate</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-surface rounded border border-surface-hi font-mono text-sm">
                Escape
              </kbd>
              <span>→ Close menu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
