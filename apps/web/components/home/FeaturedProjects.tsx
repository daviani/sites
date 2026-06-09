import Link from 'next/link';
import { StatusBadge } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';
import { STATUS_VARIANT, type Project } from '@/lib/content/projects';
import { SectionHead } from './SectionHead';

interface FeaturedProjectsProps {
  featured: Project;
  secondary: Project[];
  /** Image (carrée) du projet en vedette. */
  splashSrc: string;
}

const chip =
  'font-mono text-xs text-fg-muted bg-surface-el border border-surface-hi/55 px-[11px] py-[5px] rounded-lg';

/** Section « Projets en vedette » : vedette (splash carré centré + halo chaud) + 2 cartes. */
export async function FeaturedProjects({ featured, secondary, splashSrc }: FeaturedProjectsProps) {
  const { lang, t } = await getServerTranslations();
  const pick = (fr: string, en: string) => (lang === 'en' && en ? en : fr);
  const view = t('home.featured.view');
  const href = (p: Project) => (p.hasDetail ? `/projets/${p.slug}` : p.links[0]?.url ?? '/projets');

  return (
    <section className="py-12 md:py-[60px] border-t border-surface-hi/40">
      <SectionHead
        eyebrow={t('home.featured.eyebrow')}
        title={t('home.featured.title')}
        subtitle={t('home.featured.subtitle')}
      />

      {/* Projet en vedette */}
      <article className="grid md:grid-cols-[1fr_1.1fr] rounded-3xl overflow-hidden bg-surface border border-surface-hi/55 shadow-[0_0_0_1px_rgb(255_110_7_/_0.16),0_0_70px_-28px_rgb(255_110_7_/_0.30)]">
        <div
          className="relative min-h-[340px]"
          style={{
            background:
              'radial-gradient(ellipse at 35% 25%, color-mix(in oklab, var(--tuli-accent) 20%, transparent), transparent 55%), radial-gradient(ellipse at 80% 90%, color-mix(in oklab, var(--tuli-accent-2) 16%, transparent), transparent 55%), var(--tuli-bg-page)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={splashSrc}
            alt={`${featured.name} — ${t('home.featured.splashAlt')}`}
            loading="lazy"
            className="block h-full w-full object-cover object-[center_44%]"
          />
        </div>
        <div className="p-8 md:p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[26px] font-bold tracking-[-0.02em] text-fg">{featured.name}</h3>
            <StatusBadge variant={STATUS_VARIANT[featured.status]}>
              {t(`projects.status.${featured.status}`)}
            </StatusBadge>
          </div>
          <p className="text-base text-accent font-medium mb-3.5">
            {pick(featured.taglineFr, featured.taglineEn)}
          </p>
          <p className="text-[15px] text-fg-muted leading-[1.7] max-w-[48ch]">
            {pick(featured.summaryFr, featured.summaryEn)}
          </p>
          {featured.stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-[18px]">
              {featured.stack.map((s) => (
                <span key={s} className={chip}>
                  {s}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto pt-6">
            <Link
              href={href(featured)}
              className="inline-flex items-center gap-2 text-accent font-semibold hover:opacity-80 transition-opacity"
            >
              {view}
              <span className="text-fire" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </article>

      {/* Cartes secondaires */}
      {secondary.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          {secondary.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col rounded-2xl bg-surface border border-surface-hi/55 p-[26px] hover:border-surface-hi hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="text-[21px] font-bold tracking-[-0.01em] text-fg">{p.name}</h3>
                <span className="shrink-0">
                  <StatusBadge variant={STATUS_VARIANT[p.status]}>
                    {t(`projects.status.${p.status}`)}
                  </StatusBadge>
                </span>
              </div>
              <p className="text-[15px] text-accent font-medium mb-3">{pick(p.taglineFr, p.taglineEn)}</p>
              <p className="text-sm text-fg-muted leading-[1.65]">{pick(p.summaryFr, p.summaryEn)}</p>
              {p.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {p.stack.slice(0, 4).map((s) => (
                    <span key={s} className={chip}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-5">
                <Link
                  href={href(p)}
                  className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                  {view}
                  <span className="text-fire" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
