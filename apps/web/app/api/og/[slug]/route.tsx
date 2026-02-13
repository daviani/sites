import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/content/blog';
import { NORD_0, NORD_4, NORD_6, NORD_8 } from '@nordic-island/ui';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return new Response('Article not found', { status: 404 });
  }

  const { titleFr, excerptFr } = article.meta;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: NORD_0,
          padding: '40px 80px',
        }}
      >
        {/* Logo owl */}
{/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${new URL(request.url).origin}/owl-logo.png`}
          alt=""
          width="120"
          height="120"
          style={{ marginBottom: '40px' }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: NORD_6,
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.2,
          }}
        >
          {titleFr}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 30,
            color: NORD_4,
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          {excerptFr}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: 24,
            color: NORD_8,
          }}
        >
          blog.daviani.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    }
  );
}
