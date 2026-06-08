import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/content/blog';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Tokens Tulikettu — mode Kaamos (sombre). L'OG card est un rendu figé,
// jamais thème-aware → on fige les valeurs sombres en dur.
// Source : Design System/Tulikettu final/styles.css ([data-tuli-mode="dark"]).
const TULI_BG = '#0B1120'; // --tuli-bg
const TULI_TEXT_1 = '#E2E8F0'; // --tuli-text-1 (titre)
const TULI_TEXT_2 = '#94A3B8'; // --tuli-text-2 (excerpt)
const TULI_ACCENT = '#5BB8D4'; // --tuli-accent (cyan)

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
          backgroundColor: TULI_BG,
          padding: '40px 80px',
        }}
      >
        {/* Logo Tulikettu — renard de feu (variante ivoire sur fond sombre) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${new URL(request.url).origin}/brand/tulikettu-full-ondark-512.png`}
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
            color: TULI_TEXT_1,
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
            color: TULI_TEXT_2,
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
            color: TULI_ACCENT,
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
