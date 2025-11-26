/**
 * Valid subdomains that map to internal routes
 */
export const VALID_SUBDOMAINS = [
  'blog',
  'portfolio',
  'cv',
  'contact',
  'rdv',
  'legal',
] as const;

export type ValidSubdomain = (typeof VALID_SUBDOMAINS)[number];

/**
 * Main domain configuration
 */
export const MAIN_DOMAIN = 'daviani.dev';

/**
 * Extracts subdomain from hostname
 * Returns null for main domain, www, or localhost without subdomain
 */
export function getSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];

  // Handle localhost development
  if (host === 'localhost') {
    return null;
  }

  // Handle subdomain.localhost (e.g., blog.localhost:3000)
  if (host.endsWith('.localhost')) {
    const subdomain = host.replace('.localhost', '');
    return subdomain || null;
  }

  // Handle production domain
  const parts = host.split('.');

  // Main domain (daviani.dev) or www.daviani.dev
  if (parts.length <= 2 || (parts.length === 3 && parts[0] === 'www')) {
    return null;
  }

  // Extract subdomain (e.g., blog from blog.daviani.dev)
  const subdomain = parts[0];

  return subdomain;
}

/**
 * Returns the internal path for a given subdomain
 * Returns null if subdomain is not valid
 */
export function getRewritePath(subdomain: string): string | null {
  if (VALID_SUBDOMAINS.includes(subdomain as ValidSubdomain)) {
    return `/${subdomain}`;
  }
  return null;
}
