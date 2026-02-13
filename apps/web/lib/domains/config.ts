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
