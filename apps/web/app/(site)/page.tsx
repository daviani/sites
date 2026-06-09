import type { Metadata } from 'next';
import { getAllProjects, getAllContributions, type Project } from '@/lib/content/projects';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ExpertiseSection } from '@/components/ExpertiseSection';
import { ParcoursTeaser } from '@/components/home/ParcoursTeaser';
import { FinalCta } from '@/components/home/FinalCta';

export const metadata: Metadata = {
  title: 'Accueil',
};

export default function HomePage() {
  const projects = getAllProjects();
  // Vedette curée : RØDD + flairJob + Tulikettu. Ce dernier reste une contribution OSS,
  // mappé en carte pour l'accueil uniquement (il n'apparaît pas sur /projets).
  const featured =
    projects.find((p) => p.slug === 'rodd') ?? projects.find((p) => p.featured) ?? projects[0];
  const flairjob = projects.find((p) => p.slug === 'flairjob');
  const tuli = getAllContributions().find((c) => c.slug === 'tulikettu');
  const tulikettuCard: Project | null = tuli
    ? {
        slug: tuli.slug,
        name: 'Tulikettu',
        featured: false,
        order: tuli.order,
        status: 'coming-soon',
        taglineFr: 'Design system boréal open-source',
        taglineEn: 'Boreal open-source design system',
        summaryFr: tuli.descriptionFr,
        summaryEn: tuli.descriptionEn,
        role: '',
        roleEn: '',
        stack: ['React', 'TypeScript', 'CSS', 'Design tokens'],
        links: [{ label: 'Voir', labelEn: 'View', url: '/contributions/tulikettu' }],
        cover: null,
        screenshots: [],
        bodyFr: '',
        bodyEn: '',
        hasDetail: false,
      }
    : null;
  const secondary = [flairjob, tulikettuCard].filter(Boolean) as Project[];

  return (
    <div className="py-8 md:py-12">
      <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6">
        <HeroSection />
        {featured && (
          <FeaturedProjects
            featured={featured}
            secondary={secondary}
            splashSrc="/projects/rodd-splash.webp"
          />
        )}
        <ExpertiseSection />
        <ParcoursTeaser />
        <FinalCta />
      </div>
    </div>
  );
}
