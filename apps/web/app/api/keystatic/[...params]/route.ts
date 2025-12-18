import { makeRouteHandler } from '@keystatic/next/route-handler';
import { NextRequest } from 'next/server';
import config from '../../../../keystatic.config';

const handler = makeRouteHandler({
  config,
});

export async function GET(req: NextRequest, context: { params: Promise<{ params: string[] }> }) {
  const { params } = await context;
  const url = new URL(req.url);

  // Debug logging
  console.log('[Keystatic] GET request:', {
    path: params.params?.join('/'),
    hasCode: url.searchParams.has('code'),
    cookies: req.cookies.getAll().map(c => c.name),
    headers: {
      host: req.headers.get('host'),
      referer: req.headers.get('referer'),
    }
  });

  const response = await handler.GET(req, context);

  console.log('[Keystatic] Response:', {
    status: response.status,
    statusText: response.statusText,
  });

  return response;
}

export async function POST(req: NextRequest, context: { params: Promise<{ params: string[] }> }) {
  const { params } = await context;

  console.log('[Keystatic] POST request:', {
    path: params.params?.join('/'),
    cookies: req.cookies.getAll().map(c => c.name),
  });

  const response = await handler.POST(req, context);

  console.log('[Keystatic] Response:', {
    status: response.status,
  });

  return response;
}