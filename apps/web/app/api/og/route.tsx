import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/domains/config';

// Bannière de partage social par défaut (1200×630) générée à la volée.
// Tokens Tulikettu — mode Kaamos (sombre) figés : un OG card n'est jamais
// thème-aware. Source : Design System/Tulikettu final/styles.css.
const TULI_BG = '#0B1120'; // --tuli-bg
const TULI_TEXT_1 = '#E2E8F0'; // --tuli-text-1
const TULI_TEXT_2 = '#94A3B8'; // --tuli-text-2
const TULI_ACCENT = '#5BB8D4'; // --tuli-accent
// Renard Tulikettu (signet FoxMark) — couleurs Kaamos figées : Satori ne résout
// pas les var(--…). Orange de marque fixe ; face ivoire + détails sombres.
const FOX_ORANGE = '#FF6E07';
const FOX_FACE = '#F5F0E6'; // --tuli-mark-fg (sombre)
const FOX_DETAIL = '#131A2C'; // --fox-detail (sombre)

export function GET() {
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
        {/* Signet Tulikettu inliné (géométrie FoxMark), couleurs Kaamos figées. */}
        <svg width="150" height="150" viewBox="56 34 1140 1140" style={{ marginBottom: '36px' }}>
          <polygon
            points="215,140 291,508 256,672 319,746 384,826 447,906 519,986 555,1026 629,1068 612,1000 602,735 598,595 594,450"
            fill={FOX_ORANGE}
          />
          <polygon
            points="629,1068 650,1000 652,770 656,595 659,455 1038,140 967,508 999,666 935,746 874,826 807,906 738,986 642,1066"
            fill={FOX_FACE}
          />
          <polygon
            points="594,450 598,595 602,735 606,860 609,945 611,985 580,1007 588,1027 605,1051 631,1069 657,1051 674,1027 685,1007 650,985 651,910 656,770 659,595 659,455"
            fill={FOX_DETAIL}
          />
          <polygon points="363,644 483,698 524,781 411,735" fill={FOX_DETAIL} />
          <polygon points="771,701 895,646 849,733 731,783" fill={FOX_DETAIL} />
          <polygon
            points="476,842 484,860 498,884 511,907 520,931 527,967 531,991 533,1003 513,979 501,955 492,919 483,883 477,859"
            fill={FOX_DETAIL}
          />
          <polygon
            points="776,851 768,863 757,881 748,899 740,917 735,941 730,965 726,989 724,1001 736,989 751,965 758,941 765,911 771,881 774,863"
            fill={FOX_DETAIL}
          />
        </svg>

        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: TULI_TEXT_1,
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            fontSize: 34,
            color: TULI_TEXT_2,
            textAlign: 'center',
            marginTop: '18px',
          }}
        >
          Développeur Full-Stack &amp; DevOps
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: 26,
            color: TULI_ACCENT,
          }}
        >
          daviani.dev
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
