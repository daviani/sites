import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID
        ? `SET (starts with: ${process.env.KEYSTATIC_GITHUB_CLIENT_ID.substring(0, 8)}...)`
        : 'MISSING',
      KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET
        ? `SET (${process.env.KEYSTATIC_GITHUB_CLIENT_SECRET.length} chars)`
        : 'MISSING',
      KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET
        ? `SET (${process.env.KEYSTATIC_SECRET.length} chars)`
        : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}