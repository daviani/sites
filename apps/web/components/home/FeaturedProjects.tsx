import { getServerTranslations } from '@/lib/i18n/server';
import { type Project } from '@/lib/content/projects';
import { SectionHead } from './SectionHead';
import { FeatureCard } from '@/components/projects/FeatureCard';
import { ProjectCard } from '@/components/projects/ProjectCard';

interface FeaturedProjectsProps {
  featured: Project;
  secondary: Project[];
  /** Image (carrée) du projet en vedette. */
  splashSrc: string;
}

/** Section « Projets en vedette » : vedette (halo chaud) + cartes secondaires. */
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

      <FeatureCard
        project={featured}
        tagline={pick(featured.taglineFr, featured.taglineEn)}
        summary={pick(featured.summaryFr, featured.summaryEn)}
        statusLabel={t(`projects.status.${featured.status}`)}
        viewLabel={view}
        href={href(featured)}
        splashSrc={splashSrc}
        splashAlt={`${featured.name} — ${t('home.featured.splashAlt')}`}
        halo
      />

      {secondary.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          {secondary.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              tagline={pick(p.taglineFr, p.taglineEn)}
              summary={pick(p.summaryFr, p.summaryEn)}
              statusLabel={t(`projects.status.${p.status}`)}
              viewLabel={view}
              href={href(p)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
