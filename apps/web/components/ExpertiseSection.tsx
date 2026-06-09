'use client';

import { useTranslation } from '@/hooks/use-translation';
import { SectionHead } from './home/SectionHead';

const expertiseItems = [
  { key: 'fullstack', icon: MonitorSmartphoneIcon },
  { key: 'devops', icon: InfinityIcon },
  { key: 'infra', icon: ServerIcon },
  { key: 'architecture', icon: BoxesIcon },
  { key: 'database', icon: DatabaseIcon },
  { key: 'accessibility', icon: PersonStandingIcon },
] as const;

export function ExpertiseSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-[60px] border-t border-surface-hi/40">
      <SectionHead
        eyebrow={t('home.expertise.eyebrow')}
        title={t('home.expertise.title')}
        subtitle={t('home.expertise.subtitle')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {expertiseItems.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex flex-col rounded-2xl bg-surface border border-surface-hi/55 px-7 py-[30px] transition duration-[180ms] hover:border-surface-hi hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[color-mix(in_oklab,var(--tuli-accent)_8%,var(--tuli-surface-el))] border border-[color-mix(in_oklab,var(--tuli-accent)_16%,var(--tuli-surface-hi))] text-accent mb-[18px]">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-[19px] font-bold tracking-[-0.01em] text-fg mb-2.5">
              {t(`home.expertise.${key}.title`)}
            </h3>
            <p className="text-sm text-fg-muted leading-[1.65]">
              {t(`home.expertise.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Icônes au style Lucide (MIT) — tracés officiels, stroke 1.6 + bouts arrondis
// pour coller à la maquette (≠ Heroicons stroke 2).
function MonitorSmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
      <path d="M10 19v-3.96 3.15" />
      <path d="M7 19h5" />
      <rect width="6" height="10" x="16" y="12" rx="2" />
    </svg>
  );
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" />
    </svg>
  );
}

function ServerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

function BoxesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
      <path d="m7 16.5-4.74-2.85" />
      <path d="m7 16.5 5-3" />
      <path d="M7 16.5v5.17" />
      <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
      <path d="m17 16.5-5-3" />
      <path d="m17 16.5 4.74-2.85" />
      <path d="M17 16.5v5.17" />
      <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
      <path d="M12 8 7.26 5.15" />
      <path d="m12 8 4.74-2.85" />
      <path d="M12 13.5V8" />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function PersonStandingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <path d="m9 20 3-6 3 6" />
      <path d="m6 8 6 2 6-2" />
      <path d="M12 10v4" />
    </svg>
  );
}
