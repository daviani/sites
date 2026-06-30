import type { Metadata } from 'next';
import { getBaseUrl, SITE_NAME, SITE_DESCRIPTION } from '@/lib/domains/config';

/** Logo de marque (carré) — utilisé comme image d'entité dans le JSON-LD Person. */
const OG_IMAGE = {
  url: '/brand/tulikettu-full-ondark-512.png',
  width: 512,
  height: 512,
  alt: SITE_NAME,
};

/** Bannière de partage social (1200×630) générée à la volée — voir app/api/og. */
const OG_SOCIAL = {
  url: '/api/og',
  width: 1200,
  height: 630,
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
  /** Bannière OG contextuelle (URL absolue ou relative). Défaut : bannière de marque. */
  ogImage?: string;
}): Metadata {
  const { title, description, path, type = 'website', ogImage } = opts;
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
      images: [ogImage ? { url: ogImage, width: 1200, height: 630, alt: title } : OG_SOCIAL],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [ogImage ?? OG_SOCIAL.url],
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
    // @id stable : unifie le Person de la home, /about et /cv en UNE seule entité.
    '@id': `${baseUrl}/#person`,
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
    // @id stable : permet aux pages listing de référencer le site via isPartOf.
    '@id': `${baseUrl}/#website`,
    name: SITE_NAME,
    url: baseUrl,
    inLanguage: 'fr-FR',
    author: { '@type': 'Person', name: SITE_NAME, url: baseUrl },
  };
}

/**
 * CollectionPage + ItemList — la page /projets. Liste ordonnée de liens internes
 * vers les projets (aide Google à découvrir et hiérarchiser les pages détail).
 */
export function projectsCollectionJsonLd(items: Array<{ name: string; slug: string }>) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Projets · ${SITE_NAME}`,
    url: `${baseUrl}/projets`,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': `${baseUrl}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${baseUrl}/projets/${p.slug}`,
        name: p.name,
      })),
    },
  };
}

/** Blog + blogPost — la page /blog. Liste les articles de la page courante. */
export function blogCollectionJsonLd(
  items: Array<{ title: string; slug: string; publishedAt: string; description: string }>,
) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Blog · ${SITE_NAME}`,
    url: `${baseUrl}/blog`,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': `${baseUrl}/#website` },
    author: { '@type': 'Person', '@id': `${baseUrl}/#person`, name: SITE_NAME },
    blogPost: items.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.description,
      datePublished: a.publishedAt,
      url: `${baseUrl}/blog/${a.slug}`,
    })),
  };
}

/** BlogPosting — un article de blog. Posé sur /blog/[slug]. */
export function articleJsonLd(opts: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  /** Durée de lecture ISO 8601 (ex. « PT4M »). */
  timeRequired?: string;
  /** Résumé (key takeaways joints) — doit être visible sur la page. */
  abstract?: string;
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
    ...(opts.timeRequired ? { timeRequired: opts.timeRequired } : {}),
    ...(opts.abstract ? { abstract: opts.abstract } : {}),
  };
}

/** Person enrichi pour /cv : ajoute l'occupation et les compétences clés. */
export function cvPersonJsonLd() {
  return {
    ...personJsonLd(),
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Développeur Full-Stack & DevOps',
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'DevOps', 'Docker', 'CI/CD', 'PostgreSQL'],
    },
  };
}

/**
 * CreativeWork — un projet du portfolio. Dénominateur commun correct pour des
 * projets hétérogènes (app iOS, site web, design system) sans inventer de champs.
 * L'auteur référence le Person principal par @id (graphe d'entités unifié).
 */
export function projectJsonLd(opts: { name: string; description: string; slug: string; stack: string[] }) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description,
    url: `${baseUrl}/projets/${opts.slug}`,
    image: `${baseUrl}${ogImageUrl(opts.name)}`,
    keywords: opts.stack,
    inLanguage: 'fr-FR',
    author: { '@type': 'Person', '@id': `${baseUrl}/#person`, name: SITE_NAME },
  };
}

/** URL (relative) d'une bannière OG contextuelle pour un titre donné. */
export function ogImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set('subtitle', subtitle);
  return `/api/og?${params.toString()}`;
}
