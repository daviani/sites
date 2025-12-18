import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({
      error: 'Missing code parameter',
      usage: 'Add ?code=YOUR_CODE from the callback URL',
    });
  }

  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      error: 'Missing environment variables',
      clientId: clientId ? 'SET' : 'MISSING',
      clientSecret: clientSecret ? 'SET' : 'MISSING',
    });
  }

  // Try to exchange the code for a token
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: 'https://www.daviani.dev/api/keystatic/github/oauth/callback',
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: !data.error,
      githubResponse: data,
      debug: {
        clientIdUsed: clientId.substring(0, 8) + '...',
        clientSecretLength: clientSecret.length,
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to call GitHub',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}