import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import type { StatusBadgeVariant } from '@tulikettu/ui';

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects');
const CONTRIBUTIONS_DIR = path.join(process.cwd(), 'content/contributions');

// ───────────────────────── Projets ─────────────────────────

const linkSchema = z.object({ label: z.string(), url: z.string() });

export const PROJECT_STATUSES = ['live', 'private', 'lab', 'coming-soon'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Statut projet → variante sémantique du StatusBadge (tokens DS, pas de couleur isolée). */
export const STATUS_VARIANT: Record<ProjectStatus, StatusBadgeVariant> = {
  live: 'success',
  private: 'neutral',
  lab: 'accent',
  'coming-soon': 'warn',
};

const projectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  status: z.enum(PROJECT_STATUSES).default('live'),
  taglineFr: z.string(),
  taglineEn: z.string().default(''),
  summaryFr: z.string().default(''),
  summaryEn: z.string().default(''),
  role: z.string().default(''),
  stack: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
  cover: z.string().nullable().optional(),
  screenshots: z.array(z.string()).default([]),
});

export type ProjectMeta = z.infer<typeof projectSchema>;

export interface Project extends ProjectMeta {
  /** Corps markdoc FR de la page détail (peut être vide). */
  bodyFr: string;
  /** True si le projet a une page détail (corps non vide). */
  hasDetail: boolean;
}

function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };
  const data = (parseYaml(match[1]) as Record<string, unknown>) ?? {};
  return { data, body: match[2].trim() };
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const projects = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith('.mdoc'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
      const { data, body } = splitFrontmatter(raw);
      const meta = projectSchema.parse(data);
      return { ...meta, bodyFr: body, hasDetail: body.length > 0 };
    });

  // Tri : mis en avant d'abord, puis ordre, puis nom.
  return projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });
}

export function getProjectBySlug(slug: string): Project | null {
  return getAllProjects().find((p) => p.slug === slug) ?? null;
}

export function getProjectSlugs(): string[] {
  return getAllProjects().map((p) => p.slug);
}

// ─────────────────────── Contributions ───────────────────────

export const CONTRIBUTION_TYPES = ['talk', 'mentorat', 'article', 'oss'] as const;
export type ContributionType = (typeof CONTRIBUTION_TYPES)[number];

const contributionSchema = z.object({
  slug: z.string(),
  type: z.enum(CONTRIBUTION_TYPES).default('talk'),
  titleFr: z.string(),
  titleEn: z.string().default(''),
  descriptionFr: z.string().default(''),
  descriptionEn: z.string().default(''),
  date: z.string().default(''),
  link: z.string().nullable().optional(),
  order: z.number().default(0),
});

export type Contribution = z.infer<typeof contributionSchema>;

export function getAllContributions(): Contribution[] {
  if (!fs.existsSync(CONTRIBUTIONS_DIR)) return [];

  return fs
    .readdirSync(CONTRIBUTIONS_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTRIBUTIONS_DIR, file), 'utf-8');
      return contributionSchema.parse(parseYaml(raw) ?? {});
    })
    .sort((a, b) => a.order - b.order || a.titleFr.localeCompare(b.titleFr));
}
