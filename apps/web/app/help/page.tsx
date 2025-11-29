'use client';

import { useTranslation, TranslationKey } from '@daviani/ui';

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
    <div className="min-h-screen bg-nord6 dark:bg-nord0">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord0 dark:text-nord6">
            {t('pages.help.title')}
          </h1>
          <p className="text-xl text-nord3 dark:text-nord4">
            {t('pages.help.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          {helpSections.map((section, index) => (
            <section
              key={index}
              className="bg-white dark:bg-nord1 p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold mb-4 text-nord10 flex items-center gap-3">
                <span aria-hidden="true">{section.icon}</span>
                {t(section.titleKey)}
              </h2>
              <p className="text-nord3 dark:text-nord4 leading-relaxed">
                {t(section.textKey)}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-nord5 dark:bg-nord2 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-nord0 dark:text-nord6">
            {t('pages.help.keyboard')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-nord3 dark:text-nord4">
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-nord1 rounded border border-nord4 dark:border-nord3 font-mono text-sm">
                Tab
              </kbd>
              <span>→ Next element</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-nord1 rounded border border-nord4 dark:border-nord3 font-mono text-sm">
                Shift + Tab
              </kbd>
              <span>→ Previous element</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-nord1 rounded border border-nord4 dark:border-nord3 font-mono text-sm">
                Enter
              </kbd>
              <span>→ Activate</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white dark:bg-nord1 rounded border border-nord4 dark:border-nord3 font-mono text-sm">
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
