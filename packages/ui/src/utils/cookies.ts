/**
 * Returns the cookie domain for cross-subdomain sharing.
 * - localhost -> no domain
 * - *.localhost -> domain=localhost
 * - *.daviani.dev -> domain=.daviani.dev
 */
export function getCookieDomain(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;

  if (hostname === 'localhost') {
    return '';
  }

  if (hostname.endsWith('.localhost')) {
    return 'localhost';
  }

  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return '.' + parts.slice(-2).join('.');
  }

  return '';
}