import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@tulikettu/ui';
import { MarkdocContent } from '@/lib/markdoc';
import { getServerTranslations } from '@/lib/i18n/server';
import { getProjectBySlug, getProjectSlugs, type ProjectStatus } from '@/lib/content/projects';
import { getAllArticles } from '@/lib/content/blog';

const STATUS_CLASS: Record<ProjectStatus, string> = {
  live: 'bg-ok/15 text-ok',
  private: 'bg-surface-hi text-fg-muted',
  lab: 'bg-accent-3/15 text-accent-3',
  'coming-soon': 'bg-warn/15 text-warn',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project ? project.name : 'Projet' };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { lang, t } = await getServerTranslations();
  const pick = (fr: string, en: string) => (lang === 'en' && en ? en : fr);

  const linkedArticles = getAllArticles().filter((a) => a.meta.project === slug);

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { href: '/projets', label: t('nav.projects.title') },
              { href: `/projets/${slug}`, label: project.name },
            ]}
            homeLabel={t('common.home')}
            ariaLabel={t('common.breadcrumb')}
          />
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-fg">{project.name}</h1>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CLASS[project.status]}`}
            >
              {t(`projects.status.${project.status}`)}
            </span>
          </div>
          <p className="text-xl text-accent font-medium">{pick(project.taglineFr, project.taglineEn)}</p>
          {project.role && <p className="text-fg-muted mt-2">{project.role}</p>}
        </header>

        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.map((s) => (
              <span key={s} className="px-2.5 py-1 bg-surface-hi text-fg-muted rounded text-sm">
                {s}
              </span>
            ))}
          </div>
        )}

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            {project.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-on-accent hover:opacity-90 transition-opacity"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}

        {project.screenshots.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {project.screenshots.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${project.name} — ${i + 1}`}
                loading="lazy"
                className="w-full rounded-[var(--radius-island)] border border-surface-hi"
              />
            ))}
          </div>
        )}

        {project.bodyFr.length > 0 && (
          <div className="prose prose-tuli max-w-none glass-card p-8">
            <MarkdocContent content={project.bodyFr} />
          </div>
        )}

        {linkedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-fg mb-4">{t('projects.linkedArticles')}</h2>
            <ul className="space-y-3">
              {linkedArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/${a.slug}`}
                    className="text-accent font-medium underline underline-offset-4 hover:opacity-80"
                  >
                    {pick(a.meta.titleFr, a.meta.titleEn)} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
