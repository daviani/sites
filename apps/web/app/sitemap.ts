import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/domains/config';
import { getAllArticles } from '@/lib/content/blog';
import { getProjectSlugs, getContributionSlugs } from '@/lib/content/projects';

/**
 * /sitemap.xml — généré par Next (file convention).
 * Pages statiques (priorité décroissante selon l'importance SEO) + routes
 * dynamiques (articles de blog, projets, contributions avec page détail).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

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
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.meta.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = getProjectSlugs().map((slug) => ({
    url: `${baseUrl}/projets/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const contributionEntries: MetadataRoute.Sitemap = getContributionSlugs().map((slug) => ({
    url: `${baseUrl}/contributions/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticEntries, ...articleEntries, ...projectEntries, ...contributionEntries];
}
