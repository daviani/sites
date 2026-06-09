import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/domains/config';

/**
 * /manifest.webmanifest — généré par Next (file convention).
 * Couleurs alignées sur le thème sombre Tulikettu (Kaamos, --tuli-bg).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Développeur Full-Stack`,
    short_name: 'Daviani.dev',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1120',
    theme_color: '#0B1120',
    lang: 'fr',
    categories: ['portfolio', 'technology'],
    icons: [
      { src: '/brand/tulikettu-full-ondark-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
