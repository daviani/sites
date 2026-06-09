import type { Metadata } from 'next';
import { getBaseUrl, SITE_NAME, SITE_DESCRIPTION } from '@/lib/domains/config';

/** Image Open Graph par défaut (logo de marque), partagée par toutes les pages. */
const OG_IMAGE = {
  url: '/brand/tulikettu-full-ondark-512.png',
  width: 512,
  height: 512,
  alt: SITE_NAME,
};

/**
 * Construit la metadata d'une page : `title` (templaté en `<title>` via le
 * layout racine), `description` unique, canonical, Open Graph et Twitter Card
 * cohérents. Source unique — évite de répéter la structure OG/Twitter partout.
 *
 * `ogTitle` est explicite (`Titre · Daviani Fillatre`) car le template de title
 * du layout racine ne s'applique PAS aux champs Open Graph/Twitter.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
}): Metadata {
  const { title, description, path, type = 'website' } = opts;
  const ogTitle = `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'fr_FR',
      type,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

// ── JSON-LD (données structurées schema.org) ────────────────────────────────
// Injectées via le composant <JsonLd>. Aident Google (rich results) et les IA
// à comprendre QUI tu es, QUEL est le site, et de QUOI parle chaque article.

/** Profils publics — alignés sur les liens du Footer. */
const SAME_AS = ['https://github.com/daviani', 'https://linkedin.com/in/daviani'];

/** Person — l'entité principale du site (toi). Posé sur l'accueil. */
export function personJsonLd() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    url: baseUrl,
    image: `${baseUrl}${OG_IMAGE.url}`,
    jobTitle: 'Développeur Full-Stack & DevOps',
    description: SITE_DESCRIPTION,
    sameAs: SAME_AS,
    knowsAbout: ['React', 'Next.js', 'Node.js', 'TypeScript', 'DevOps', 'Docker', 'CI/CD', 'IA'],
  };
}

/** WebSite — le site lui-même. */
export function websiteJsonLd() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: baseUrl,
    inLanguage: 'fr-FR',
    author: { '@type': 'Person', name: SITE_NAME, url: baseUrl },
  };
}

/** BlogPosting — un article de blog. Posé sur /blog/[slug]. */
export function articleJsonLd(opts: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags: string[];
}) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.publishedAt,
    url: `${baseUrl}/blog/${opts.slug}`,
    image: `${baseUrl}/api/og/${opts.slug}`,
    keywords: opts.tags,
    inLanguage: 'fr-FR',
    author: { '@type': 'Person', name: SITE_NAME, url: baseUrl },
    publisher: { '@type': 'Person', name: SITE_NAME, url: baseUrl },
  };
}
