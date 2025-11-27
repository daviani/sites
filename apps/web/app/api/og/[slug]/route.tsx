import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/content/blog';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return new Response('Article not found', { status: 404 });
  }

  const { title, description } = article.meta;

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
          backgroundColor: '#2E3440',
          padding: '40px 80px',
        }}
      >
        {/* Logo owl */}
        <img
          src={`${new URL(request.url).origin}/owl-logo.png`}
          width="120"
          height="120"
          style={{ marginBottom: '40px' }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: '#ECEFF4',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 30,
            color: '#D8DEE9',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          {description}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: 24,
            color: '#88C0D0',
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
