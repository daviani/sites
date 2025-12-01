import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

/**
 * Schema for article metadata validation
 */
const metaSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  lang: z.enum(['fr', 'en']).default('fr'),
  readingTime: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  featured: z.boolean().optional(),
  slug: z.string(),
});

export type ArticleMeta = z.infer<typeof metaSchema>;

export interface Article {
  slug: string;
  meta: ArticleMeta;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

/**
 * Extract meta export from MDX file content
 */
function extractMeta(content: string, slug: string): ArticleMeta {
  const metaMatch = content.match(/export\s+const\s+meta\s*=\s*(\{[\s\S]*?\});/);

  if (!metaMatch) {
    return metaSchema.parse({ slug, title: slug, description: '', date: new Date().toISOString() });
  }

  try {
    const metaObj = new Function(`return ${metaMatch[1]}`)();
    return metaSchema.parse({ ...metaObj, slug });
  } catch {
    return metaSchema.parse({ slug, title: slug, description: '', date: new Date().toISOString() });
  }
}

/**
 * Get all published articles sorted by date (newest first)
 */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const filePath = path.join(BLOG_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMeta(content, slug);
      return { slug, meta };
    })
    .filter((a) => a.meta.status === 'published')
    .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
}

/**
 * Get a single article by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const meta = extractMeta(content, slug);

  return { slug, meta };
}

/**
 * Get all unique tags from published articles
 */
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set<string>();

  articles.forEach((article) => {
    article.meta.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
