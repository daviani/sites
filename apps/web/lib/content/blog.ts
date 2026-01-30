import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

/**
 * Schema for article metadata validation (i18n format)
 */
const metaSchema = z.object({
  slug: z.string(),
  publishedAt: z.string(),
  featured: z.boolean().default(false),
  titleFr: z.string(),
  titleEn: z.string(),
  excerptFr: z.string().default(''),
  excerptEn: z.string().default(''),
  tags: z.array(z.string()).default([]),
});

export type ArticleMeta = z.infer<typeof metaSchema>;

export interface Article {
  slug: string;
  meta: ArticleMeta;
  content: string;
  contentEn?: string;
}

/**
 * Posts directory
 */
const POSTS_DIR = path.join(process.cwd(), 'content/posts');

/**
 * Parse YAML frontmatter from markdoc content
 */
function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const yamlContent = match[1];
  const markdownContent = match[2];

  // Simple YAML parser for our use case
  const data: Record<string, unknown> = {};
  let currentKey = '';
  let inArray = false;
  let inMultiline = false;
  let arrayValues: string[] = [];
  let multilineValues: string[] = [];

  const lines = yamlContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Multiline continuation (indented line after >- or |-)
    if (inMultiline && line.startsWith('  ') && !line.startsWith('  - ')) {
      multilineValues.push(line.trim());
      continue;
    }

    // End of multiline
    if (inMultiline && !line.startsWith('  ')) {
      data[currentKey] = multilineValues.join(' ');
      inMultiline = false;
      multilineValues = [];
    }

    // Array item
    if (line.startsWith('  - ') && inArray) {
      arrayValues.push(line.slice(4).trim());
      continue;
    }

    // If we were in an array, save it
    if (inArray && !line.startsWith('  - ')) {
      data[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    // Key-value pair
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      currentKey = key;

      if (value === '') {
        // Could be start of array
        inArray = true;
        arrayValues = [];
      } else if (value === '>-' || value === '|-' || value === '>' || value === '|') {
        // Multiline string indicator
        inMultiline = true;
        multilineValues = [];
      } else {
        // Parse value
        let parsedValue: string | boolean = value;

        // Remove quotes
        if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
          parsedValue = value.slice(1, -1);
        }
        // Parse boolean
        else if (value === 'true') {
          parsedValue = true;
        } else if (value === 'false') {
          parsedValue = false;
        }

        data[key] = parsedValue;
      }
    }
  }

  // Handle trailing array
  if (inArray) {
    data[currentKey] = arrayValues;
  }

  // Handle trailing multiline
  if (inMultiline) {
    data[currentKey] = multilineValues.join(' ');
  }

  return { data, content: markdownContent };
}

/**
 * Get all published articles sorted by date (newest first)
 */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdoc'));
  const articles: Article[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdoc$/, '');
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = parseFrontmatter(fileContent);

    // Check for English content
    const enContentPath = path.join(POSTS_DIR, slug, 'contentEn.mdoc');
    let contentEn: string | undefined;
    if (fs.existsSync(enContentPath)) {
      contentEn = fs.readFileSync(enContentPath, 'utf-8');
    }

    try {
      const meta = metaSchema.parse({ ...data, slug });
      articles.push({ slug, meta, content, contentEn });
    } catch {
      // Skip invalid articles
    }
  }

  return articles.sort((a, b) => (a.meta.publishedAt < b.meta.publishedAt ? 1 : -1));
}

/**
 * Get a single article by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdoc`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = parseFrontmatter(fileContent);

  // Check for English content
  const enContentPath = path.join(POSTS_DIR, slug, 'contentEn.mdoc');
  let contentEn: string | undefined;
  if (fs.existsSync(enContentPath)) {
    contentEn = fs.readFileSync(enContentPath, 'utf-8');
  }

  try {
    const meta = metaSchema.parse({ ...data, slug });
    return { slug, meta, content, contentEn };
  } catch {
    return null;
  }
}

/**
 * Get all unique tags from published articles
 */
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set<string>();

  for (const article of articles) {
    for (const tag of article.meta.tags) {
      tags.add(tag);
    }
  }

  return Array.from(tags).sort();
}

/**
 * Get featured articles
 */
export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((article) => article.meta.featured);
}