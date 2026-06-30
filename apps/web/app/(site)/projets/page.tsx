import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';
import { getAllProjects, getAllContributions, type Project, type Contribution } from '@/lib/content/projects';
import { FeatureCard } from '@/components/projects/FeatureCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { pageMetadata, projectsCollectionJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Projets',
  description:
    'Mes projets et contributions open-source : produits web, labs et expérimentations en React, Next.js, Node.js et DevOps.',
  path: '/projets',
});

export default async function ProjetsPage() {
  const { lang, t } = await getServerTranslations();
  const pick = (fr: string, en: string) => (lang === 'en' && en ? en : fr);
  const projects = getAllProjects();
  const featured =
    projects.find((p) => p.slug === 'rodd') ?? projects.find((p) => p.featured) ?? projects[0];
  const grid = projects.filter((p) => p.slug !== featured?.slug);
  const contributions = getAllContributions();
  const href = (p: Project) => (p.hasDetail ? `/projets/${p.slug}` : p.links[0]?.url ?? '/projets');

  return (
    <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <JsonLd
        data={projectsCollectionJsonLd(
          projects.filter((p) => p.hasDetail).map((p) => ({ name: p.name, slug: p.slug })),
        )}
      />
      <Breadcrumb
        items={[{ href: '/projets', label: t('nav.projects.title') }]}
        homeLabel={t('common.home')}
        ariaLabel={t('common.breadcrumb')}
      />

      {/* En-tête de page */}
      <div className="text-center pt-[54px] pb-9">
        <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
          {t('projects.eyebrow')}
        </span>
        <h1 className="text-[clamp(40px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
          {t('projects.title')}
        </h1>
        <p className="text-[17px] text-fg-muted mt-3.5 max-w-[54ch] mx-auto">{t('projects.subtitle')}</p>
      </div>

      {/* Projet en vedette (sans halo : réservé à l'accueil) */}
      <h2 className="sr-only">{t('projects.featuredHeading')}</h2>
      {featured && (
        <FeatureCard
          project={featured}
          tagline={pick(featured.taglineFr, featured.taglineEn)}
          summary={pick(featured.summaryFr, featured.summaryEn)}
          statusLabel={t(`projects.status.${featured.status}`)}
          viewLabel={t('projects.viewProject')}
          href={href(featured)}
          splashSrc="/projects/rodd-splash.webp"
          splashAlt={`${featured.name} — ${t('home.featured.splashAlt')}`}
          badgeInVisual
        />
      )}

      {/* Grille des autres projets */}
      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        {grid.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            tagline={pick(p.taglineFr, p.taglineEn)}
            summary={pick(p.summaryFr, p.summaryEn)}
            statusLabel={t(`projects.status.${p.status}`)}
            viewLabel={t('projects.viewProject')}
            href={href(p)}
          />
        ))}
      </div>

      {/* Contributions */}
      {contributions.length > 0 && (
        <section className="mt-[30px] pt-12 border-t border-surface-hi/40">
          <h2 className="text-[30px] font-bold tracking-[-0.025em] text-fg">
            {t('projects.contributionsTitle')}
          </h2>
          <p className="text-fg-muted mt-2">{t('projects.contributionsSubtitle')}</p>
          <div className="flex flex-col gap-3.5 mt-[26px]">
            {contributions.map((c) => (
              <ContribRow key={c.slug} c={c} pick={pick} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ContribRow({
  c,
  pick,
}: {
  c: Contribution;
  pick: (fr: string, en: string) => string;
}) {
  const title = pick(c.titleFr, c.titleEn);
  const desc = pick(c.descriptionFr, c.descriptionEn);
  const date = pick(c.date, c.dateEn);
  // Cible : page détail si corps présent, sinon lien rapide (ex. /blog), sinon inerte.
  const href = c.hasDetail ? `/contributions/${c.slug}` : c.link ?? null;
  const base = 'rounded-2xl bg-surface border border-surface-hi/55 px-[26px] py-[22px]';

  // Inerte (ex. Mentorat) : aucune cible.
  if (!href) {
    return (
      <div className={base}>
        <h3 className="text-lg font-bold tracking-[-0.01em] text-fg">{title}</h3>
        {date && <div className="font-mono text-xs text-fg-subtle mt-[3px] mb-[9px]">{date}</div>}
        {desc && <p className="text-[14.5px] text-fg-muted leading-[1.6]">{desc}</p>}
      </div>
    );
  }

  // Cliquable : toute la row via stretched-link sur le titre.
  return (
    <div className={`relative ${base} transition-colors hover:border-surface-hi`}>
      <h3 className="text-lg font-bold tracking-[-0.01em] text-fg">
        <Link
          href={href}
          aria-label={title}
          className="transition-colors hover:text-accent after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {title}
        </Link>
      </h3>
      {date && <div className="font-mono text-xs text-fg-subtle mt-[3px] mb-[9px]">{date}</div>}
      {desc && <p className="text-[14.5px] text-fg-muted leading-[1.6]">{desc}</p>}
      <span
        className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold mt-2.5"
        aria-hidden="true"
      >
        {!c.hasDetail && c.link}
        <span className="text-fire">→</span>
      </span>
    </div>
  );
}
