import { makeRouteHandler } from '@keystatic/next/route-handler';
import { NextRequest } from 'next/server';
import config from '../../../../keystatic.config';

const handler = makeRouteHandler({
  config,
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathMatch = url.pathname.match(/\/api\/keystatic\/(.+)/);
  const path = pathMatch ? pathMatch[1] : '';

  // Debug logging
  console.log('[Keystatic] GET request:', {
    path,
    hasCode: url.searchParams.has('code'),
    hasState: url.searchParams.has('state'),
    cookies: req.cookies.getAll().map(c => c.name),
    host: req.headers.get('host'),
  });

  const response = await handler.GET(req);

  // Log redirect details
  const location = response.headers.get('location');
  const setCookies = response.headers.get('set-cookie');

  console.log('[Keystatic] Response:', {
    status: response.status,
    statusText: response.statusText,
    redirectTo: location ? location.substring(0, 150) + '...' : null,
    setCookies: setCookies ? 'YES' : 'NO',
  });

  return response;
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const pathMatch = url.pathname.match(/\/api\/keystatic\/(.+)/);
  const path = pathMatch ? pathMatch[1] : '';

  console.log('[Keystatic] POST request:', {
    path,
    cookies: req.cookies.getAll().map(c => c.name),
  });

  const response = await handler.POST(req);

  console.log('[Keystatic] Response:', {
    status: response.status,
  });

  return response;
}