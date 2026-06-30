import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/domains/config';
import { getAllArticles } from '@/lib/content/blog';
import { getAllProjects, getAllContributions } from '@/lib/content/projects';

/**
 * /sitemap.xml — généré par Next (file convention).
 * Pages statiques (priorité décroissante selon l'importance SEO) + routes
 * dynamiques (articles de blog, projets, contributions avec page détail).
 */
/**
 * Date de dernière refonte des pages statiques. À bumper manuellement lors d'un
 * changement de contenu statique significatif (≠ date de build, qui serait un
 * faux signal pour les crawlers). ⚠️ Checklist release : rebumper si le contenu
 * statique a changé depuis la dernière mise en prod.
 */
const SITE_UPDATED = new Date('2026-06-17');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
  }> = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/projets', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/cv', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/photos', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/legal', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/help', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/plan-du-site', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      lastModified: SITE_UPDATED,
      changeFrequency,
      priority,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.meta.updatedAt || article.meta.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: `${baseUrl}/projets/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : SITE_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const contributionEntries: MetadataRoute.Sitemap = getAllContributions()
    .filter((c) => c.hasDetail)
    .map((c) => ({
      url: `${baseUrl}/contributions/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : SITE_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  return [...staticEntries, ...articleEntries, ...projectEntries, ...contributionEntries];
}
