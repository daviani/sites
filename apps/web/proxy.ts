import { NextRequest, NextResponse } from 'next/server';
import { getSubdomain, getRewritePath } from '@/lib/domains/config';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|api).*)',
  ],
};

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = getSubdomain(hostname);

  // No subdomain, continue normally
  if (!subdomain) {
    return NextResponse.next();
  }

  const rewritePath = getRewritePath(subdomain);

  // Unknown subdomain, continue normally
  if (!rewritePath) {
    return NextResponse.next();
  }

  // Rewrite to the subdomain's page
  const url = request.nextUrl.clone();
  url.pathname = `${rewritePath}${url.pathname === '/' ? '' : url.pathname}`;

  return NextResponse.rewrite(url);
}
