import Link from 'next/link';
import { StatusBadge, Tag } from '@tulikettu/ui';
import { STATUS_VARIANT, type Project } from '@/lib/content/projects';

export interface ProjectCardProps {
  project: Project;
  tagline: string;
  summary: string;
  statusLabel: string;
  viewLabel: string;
  href: string;
}

/** Carte projet « pcard » : grille de l'accueil et de /projets (style unifié). */
export function ProjectCard({
  project,
  tagline,
  summary,
  statusLabel,
  viewLabel,
  href,
}: ProjectCardProps) {
  return (
    <article className="relative flex flex-col rounded-2xl bg-surface border border-surface-hi/55 p-[26px] hover:border-surface-hi hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3 className="text-[21px] font-bold tracking-[-0.01em] text-fg">{project.name}</h3>
        <span className="shrink-0">
          <StatusBadge variant={STATUS_VARIANT[project.status]}>{statusLabel}</StatusBadge>
        </span>
      </div>
      <p className="text-[15px] text-accent font-medium mb-3">{tagline}</p>
      {summary && <p className="text-sm text-fg-muted leading-[1.65]">{summary}</p>}
      {project.stack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {project.stack.slice(0, 4).map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      )}
      <div className="mt-auto pt-5">
        <Link
          href={href}
          aria-label={`${viewLabel} — ${project.name}`}
          className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:opacity-80 transition-opacity after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          {viewLabel}
          <span className="text-fire" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
