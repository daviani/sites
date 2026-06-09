import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/domains/config';

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
