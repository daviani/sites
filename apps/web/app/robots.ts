import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/domains/config';

/**
 * /robots.txt — généré par Next (file convention).
 * Autorise tout le crawl public, bloque l'admin Keystatic, et pointe vers le sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/keystatic', '/api/keystatic'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
