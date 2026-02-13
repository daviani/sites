/**
 * Returns the cookie domain.
 * Without subdomains, cookies are scoped to the current domain automatically.
 * Returns empty string so no explicit domain is set on cookies.
 */
export function getCookieDomain(): string {
  return '';
}
