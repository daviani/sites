import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb, StatusBadge } from '@tulikettu/ui';
import Image from 'next/image';
import { MarkdocContent } from '@/lib/markdoc';
import { imageDimensions } from '@/lib/images';
import { getServerTranslations } from '@/lib/i18n/server';
import { getProjectBySlug, getProjectSlugs, STATUS_VARIANT } from '@/lib/content/projects';
import { getAllArticles } from '@/lib/content/blog';
import { pageMetadata, projectJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Projet' };
  return pageMetadata({
    title: project.name,
    description: project.summaryFr || project.taglineFr,
    path: `/projets/${slug}`,
    type: 'article',
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { lang, t } = await getServerTranslations();
  const pick = (fr: string, en: string) => (lang === 'en' && en ? en : fr);
  const role = pick(project.role, project.roleEn);
  const body = pick(project.bodyFr, project.bodyEn);

  const linkedArticles = getAllArticles().filter((a) => a.meta.project === slug);

  const shots = await Promise.all(
    project.screenshots.map(async (src) => ({ src, dims: await imageDimensions(src) }))
  );

  return (
    <div>
      <JsonLd
        data={projectJsonLd({
          name: project.name,
          description: project.summaryFr || project.taglineFr,
          slug,
          stack: project.stack,
        })}
      />
      <div className="w-[var(--content-width)] mx-auto px-4 pt-5 pb-16">
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
            <StatusBadge variant={STATUS_VARIANT[project.status]}>
              {t(`projects.status.${project.status}`)}
            </StatusBadge>
            {role && <span className="text-sm text-fg-subtle">{role}</span>}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-3">{project.name}</h1>
          <p className="text-xl text-accent font-medium">{pick(project.taglineFr, project.taglineEn)}</p>
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
                {pick(l.label, l.labelEn)} ↗
              </a>
            ))}
          </div>
        )}

        {shots.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {shots.map(({ src, dims }, i) =>
              dims ? (
                <Image
                  key={src}
                  src={src}
                  alt={`${project.name} — ${i + 1}`}
                  width={dims.width}
                  height={dims.height}
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="h-auto w-full rounded-[var(--radius-island)] border border-surface-hi"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`${project.name} — ${i + 1}`}
                  loading="lazy"
                  className="w-full rounded-[var(--radius-island)] border border-surface-hi"
                />
              )
            )}
          </div>
        )}

        {body.length > 0 && (
          <div className="prose prose-tuli mx-auto glass-card p-8">
            <MarkdocContent content={body} />
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
