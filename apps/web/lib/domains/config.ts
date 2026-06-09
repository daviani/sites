/**
 * Environment-based configuration
 */
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'daviani.dev';
const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL || 'https';
const PORT = process.env.NEXT_PUBLIC_PORT || '';

/**
 * Returns the port suffix for URLs (e.g., ":3000" in dev, "" in prod)
 */
function getPortSuffix(): string {
  return PORT ? `:${PORT}` : '';
}

/**
 * Returns the base URL (protocol + domain + port)
 */
export function getBaseUrl(): string {
  return `${PROTOCOL}://${DOMAIN}${getPortSuffix()}`;
}

/** Nom de marque — réutilisé dans metadata, Open Graph et manifest. */
export const SITE_NAME = 'Daviani Fillatre';

/**
 * Description du site — la phrase affichée par Google sous le titre, et reprise
 * au partage social (Open Graph / Twitter) ainsi que dans le manifest PWA.
 * Source unique : la modifier ici la propage partout.
 */
export const SITE_DESCRIPTION =
  'Développeur full-stack & DevOps. Je conçois des applications web rapides et soignées en React, Next.js et Node.js. Mes projets, articles et CV.';
