import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID || '';
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || '';
  const secret = process.env.KEYSTATIC_SECRET || '';

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      KEYSTATIC_GITHUB_CLIENT_ID: clientId
        ? {
            status: 'SET',
            length: clientId.length,
            startsWidth: clientId.substring(0, 8),
            hasWhitespace: /\s/.test(clientId),
            hasNewline: /\n/.test(clientId),
          }
        : 'MISSING',
      KEYSTATIC_GITHUB_CLIENT_SECRET: clientSecret
        ? {
            status: 'SET',
            length: clientSecret.length,
            expectedLength: 40,
            hasWhitespace: /\s/.test(clientSecret),
            hasNewline: /\n/.test(clientSecret),
            firstChar: clientSecret[0],
            lastChar: clientSecret[clientSecret.length - 1],
          }
        : 'MISSING',
      KEYSTATIC_SECRET: secret
        ? {
            status: 'SET',
            length: secret.length,
            hasWhitespace: /\s/.test(secret),
            hasNewline: /\n/.test(secret),
            isHex: /^[a-f0-9]+$/i.test(secret),
          }
        : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}