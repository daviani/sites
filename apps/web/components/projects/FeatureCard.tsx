import Link from 'next/link';
import Image from 'next/image';
import { StatusBadge, Tag } from '@tulikettu/ui';
import { STATUS_VARIANT, type Project } from '@/lib/content/projects';

// Halo chaud de mise en avant (réservé à la vedette de l'accueil).
const HALO = 'shadow-[0_0_0_1px_rgb(255_110_7_/_0.16),0_0_70px_-28px_rgb(255_110_7_/_0.30)]';

export interface FeatureCardProps {
  project: Project;
  tagline: string;
  summary: string;
  statusLabel: string;
  viewLabel: string;
  href: string;
  splashSrc: string;
  splashAlt: string;
  /** Halo chaud (accueil). Off par défaut (ex. /projets). */
  halo?: boolean;
  /** Badge en haut-gauche du visuel (maquette /projets) au lieu d'à côté du titre. */
  badgeInVisual?: boolean;
}

/** Carte projet « vedette » : visuel plein cadre + corps. Partagée accueil / projets. */
export function FeatureCard({
  project,
  tagline,
  summary,
  statusLabel,
  viewLabel,
  href,
  splashSrc,
  splashAlt,
  halo = false,
  badgeInVisual = false,
}: FeatureCardProps) {
  return (
    <article
      className={`relative grid md:grid-cols-[1fr_1.1fr] rounded-3xl overflow-hidden bg-surface border border-surface-hi/55${
        halo ? ` ${HALO}` : ''
      }`}
    >
      <div
        className="relative min-h-[340px]"
        style={{
          background:
            'radial-gradient(ellipse at 35% 25%, color-mix(in oklab, var(--tuli-accent) 20%, transparent), transparent 55%), radial-gradient(ellipse at 80% 90%, color-mix(in oklab, var(--tuli-accent-2) 16%, transparent), transparent 55%), var(--tuli-bg-page)',
        }}
      >
        {badgeInVisual && (
          <span className="absolute top-4 left-4 z-10">
            <StatusBadge variant={STATUS_VARIANT[project.status]}>{statusLabel}</StatusBadge>
          </span>
        )}
        <Image
          src={splashSrc}
          alt={splashAlt}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover object-[center_44%]"
        />
      </div>
      <div className="p-8 md:p-10 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-[26px] font-bold tracking-[-0.02em] text-fg">{project.name}</h3>
          {!badgeInVisual && (
            <StatusBadge variant={STATUS_VARIANT[project.status]}>{statusLabel}</StatusBadge>
          )}
        </div>
        <p className="text-base text-accent font-medium mb-3.5">{tagline}</p>
        {summary && (
          <p className="text-[15px] text-fg-muted leading-[1.7] max-w-[48ch]">{summary}</p>
        )}
        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-[18px]">
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        )}
        <div className="mt-auto pt-6">
          <Link
            href={href}
            aria-label={`${viewLabel} — ${project.name}`}
            className="inline-flex items-center gap-2 text-accent font-semibold hover:opacity-80 transition-opacity after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            {viewLabel}
            <span className="text-fire" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
