import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Extraire le sous-domaine
  const subdomain = hostname.split('.')[0];

  // Mapping des sous-domaines vers les routes
  const subdomainRoutes: Record<string, string> = {
    'portfolio': '/portfolio',
    'blog': '/blog',
    'contact': '/contact',
    'rdv': '/rdv',
    'cv': '/cv',
    'legal': '/legal',
  };

  // Pour localhost, on peut tester avec des query params
  // Ex: localhost:3000?subdomain=blog
  if (hostname.includes('localhost')) {
    const testSubdomain = url.searchParams.get('subdomain');
    if (testSubdomain && subdomainRoutes[testSubdomain]) {
      url.pathname = `${subdomainRoutes[testSubdomain]}${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
    // Par défaut sur localhost → page principale
    return NextResponse.next();
  }

  // En production, router selon le sous-domaine
  if (subdomainRoutes[subdomain]) {
    url.pathname = `${subdomainRoutes[subdomain]}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Domaine principal (daviani.dev) → page principale
  return NextResponse.next();
}
