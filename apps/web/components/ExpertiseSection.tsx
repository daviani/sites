'use client';

import { useTranslation } from '@/hooks/use-translation';

const expertiseItems = [
  { key: 'fullstack', icon: CodeIcon },
  { key: 'devops', icon: RocketIcon },
  { key: 'infra', icon: ServerIcon },
  { key: 'architecture', icon: LayoutIcon },
  { key: 'database', icon: DatabaseIcon },
  { key: 'accessibility', icon: AccessibilityIcon },
] as const;

export function ExpertiseSection() {
  const { t } = useTranslation();

  return (
    <section className="mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-nord-0 dark:text-nord-6">
        {t('home.expertise.title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {expertiseItems.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="p-6 rounded-lg bg-nord-6 dark:bg-nord-1 border border-nord-4 dark:border-nord-2 transition-colors hover:border-nord-10 dark:hover:border-nord-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-md bg-nord-10/10 text-nord-10">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-nord-0 dark:text-nord-6">
                {t(`home.expertise.${key}.title`)}
              </h3>
            </div>
            <p className="text-sm text-nord-2 dark:text-nord-4 leading-relaxed">
              {t(`home.expertise.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function ServerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}

function AccessibilityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-1.657 0-3 .672-3 1.5s1.343 1.5 3 1.5 3-.672 3-1.5-1.343-1.5-3-1.5zM12 7.5v3m0 0l-3 6m3-6l3 6m-6 0h6" />
    </svg>
  );
}
