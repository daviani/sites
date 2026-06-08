import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@tulikettu/ui';
import { getServerTranslations } from '@/lib/i18n/server';
import {
  getAllProjects,
  getAllContributions,
  type Project,
  type ProjectStatus,
} from '@/lib/content/projects';

export const metadata: Metadata = {
  title: 'Projets',
};

const STATUS_CLASS: Record<ProjectStatus, string> = {
  live: 'bg-ok/15 text-ok',
  private: 'bg-surface-hi text-fg-muted',
  lab: 'bg-accent-3/15 text-accent-3',
  'coming-soon': 'bg-warn/15 text-warn',
};

export default async function ProjetsPage() {
  const { lang, t } = await getServerTranslations();
  const projects = getAllProjects();
  const contributions = getAllContributions();
  const pick = (fr: string, en: string) => (lang === 'en' && en ? en : fr);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb
            items={[{ href: '/projets', label: t('nav.projects.title') }]}
            homeLabel={t('common.home')}
            ariaLabel={t('common.breadcrumb')}
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-fg">{t('projects.title')}</h1>
          <p className="text-xl text-fg-muted">{t('projects.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              tagline={pick(project.taglineFr, project.taglineEn)}
              summary={pick(project.summaryFr, project.summaryEn)}
              statusLabel={t(`projects.status.${project.status}`)}
              viewLabel={t('projects.viewProject')}
            />
          ))}
        </div>

        {contributions.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-fg mb-6">
              {t('projects.contributionsTitle')}
            </h2>
            <ul className="space-y-4">
              {contributions.map((c) => {
                const desc = pick(c.descriptionFr, c.descriptionEn);
                const isExternal = !!c.link && /^https?:\/\//.test(c.link);
                return (
                  <li
                    key={c.slug}
                    className="p-5 rounded-2xl bg-surface/70 backdrop-blur-sm border border-surface-hi"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold text-fg">{pick(c.titleFr, c.titleEn)}</h3>
                      {c.date && <span className="text-xs text-fg-subtle shrink-0">{c.date}</span>}
                    </div>
                    {desc && <p className="text-fg-muted text-sm mt-1 leading-relaxed">{desc}</p>}
                    {c.link &&
                      (isExternal ? (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent text-sm underline underline-offset-4 hover:opacity-80 mt-2 inline-block"
                        >
                          {c.link.replace(/^https?:\/\//, '')} ↗
                        </a>
                      ) : (
                        <Link
                          href={c.link}
                          className="text-accent text-sm underline underline-offset-4 hover:opacity-80 mt-2 inline-block"
                        >
                          {c.link} →
                        </Link>
                      ))}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  tagline,
  summary,
  statusLabel,
  viewLabel,
}: {
  project: Project;
  tagline: string;
  summary: string;
  statusLabel: string;
  viewLabel: string;
}) {
  return (
    <article className="p-6 glass-card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-fg">{project.name}</h2>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_CLASS[project.status]}`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="text-accent font-medium">{tagline}</p>
      {summary && <p className="text-fg-muted text-sm leading-relaxed">{summary}</p>}

      {project.stack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {project.stack.map((s) => (
            <span key={s} className="px-2 py-1 bg-surface-hi text-fg-muted rounded text-xs">
              {s}
            </span>
          ))}
        </div>
      )}

      {(project.hasDetail || project.links.length > 0) && (
        <div className="flex flex-wrap items-center gap-4 mt-auto pt-2">
          {project.hasDetail && (
            <Link
              href={`/projets/${project.slug}`}
              className="text-accent font-medium hover:opacity-80 transition-opacity"
            >
              {viewLabel} →
            </Link>
          )}
          {project.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-fg-muted underline underline-offset-4 hover:text-accent transition-colors"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
