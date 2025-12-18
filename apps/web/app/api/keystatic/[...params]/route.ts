import { makeRouteHandler } from '@keystatic/next/route-handler';
import { NextRequest, NextResponse } from 'next/server';
import config from '../../../../keystatic.config';

// Temporary debug endpoint
const DEBUG = true;

const handler = makeRouteHandler({
  config,
});

export async function GET(req: NextRequest, context: { params: Promise<{ params: string[] }> }) {
  const { params } = await context;

  // Debug: log environment variable status (not values!)
  if (DEBUG) {
    console.log('[Keystatic Debug] Route params:', params);
    console.log('[Keystatic Debug] Environment check:');
    console.log('  - KEYSTATIC_GITHUB_CLIENT_ID:', process.env.KEYSTATIC_GITHUB_CLIENT_ID ? '✓ SET' : '✗ MISSING');
    console.log('  - KEYSTATIC_GITHUB_CLIENT_SECRET:', process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ? `✓ SET (${process.env.KEYSTATIC_GITHUB_CLIENT_SECRET.length} chars)` : '✗ MISSING');
    console.log('  - KEYSTATIC_SECRET:', process.env.KEYSTATIC_SECRET ? `✓ SET (${process.env.KEYSTATIC_SECRET.length} chars)` : '✗ MISSING');
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
  }

  try {
    const response = await handler.GET(req, context);
    return response;
  } catch (error) {
    console.error('[Keystatic Error]', error);
    if (DEBUG) {
      return NextResponse.json({
        error: 'Authorization failed',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          env: {
            clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID ? 'SET' : 'MISSING',
            clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ? 'SET' : 'MISSING',
            secret: process.env.KEYSTATIC_SECRET ? 'SET' : 'MISSING',
            nodeEnv: process.env.NODE_ENV,
          }
        }
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Authorization failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ params: string[] }> }) {
  try {
    return await handler.POST(req, context);
  } catch (error) {
    console.error('[Keystatic Error]', error);
    if (DEBUG) {
      return NextResponse.json({
        error: 'Request failed',
        debug: {
          message: error instanceof Error ? error.message : String(error),
        }
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}