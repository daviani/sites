'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/hooks/use-translation';

export function NotFoundContent() {
  const { t } = useTranslation();
  const [glitchActive, setGlitchActive] = useState(false);

  // Glitch effect on hover
  const handleMouseEnter = () => setGlitchActive(true);
  const handleMouseLeave = () => setGlitchActive(false);

  // Random glitch effect periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const glitchStyles = useMemo(
    () => `
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
    @keyframes glitch-skew {
      0% { transform: skew(0deg); }
      20% { transform: skew(2deg); }
      40% { transform: skew(-2deg); }
      60% { transform: skew(1deg); }
      80% { transform: skew(-1deg); }
      100% { transform: skew(0deg); }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    .glitch-text {
      animation: glitch 0.3s ease-in-out infinite, glitch-skew 0.5s ease-in-out infinite;
    }
    .scanline {
      position: absolute;
      width: 100%;
      height: 4px;
      background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--tuli-accent-2) 30%, transparent), transparent);
      animation: scanline 2s linear infinite;
    }
  `,
    []
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <style>{glitchStyles}</style>

      {/* Scanline effect */}
      <div className="scanline pointer-events-none" aria-hidden="true" />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(color-mix(in srgb, var(--tuli-accent-2) 50%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--tuli-accent-2) 50%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      <div className="text-center px-6 relative z-10">
        {/* 404 Title with glitch effect */}
        <h1
          className={`text-[10rem] md:text-[15rem] font-bold leading-none select-none ${
            glitchActive ? 'glitch-text' : ''
          }`}
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px',
            WebkitTextStrokeColor: glitchActive
              ? 'var(--tuli-err)'
              : 'var(--tuli-accent)',
            textShadow: glitchActive
              ? '2px 2px var(--tuli-err), -2px -2px var(--tuli-accent-2)'
              : 'none',
            transition: 'all 0.1s ease',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={t('easterEggs.notFound.title')}
        >
          {t('easterEggs.notFound.title')}
        </h1>

        {/* Glitch text decoration */}
        <div
          className="font-mono text-xs text-err dark:text-warn mb-8 tracking-widest opacity-60"
          aria-hidden="true"
        >
          {t('easterEggs.notFound.glitchText')}
        </div>

        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl font-semibold text-fg mb-4">
          {t('easterEggs.notFound.subtitle')}
        </h2>

        {/* Description */}
        <p className="text-fg-muted mb-8 max-w-md mx-auto">
          {t('easterEggs.notFound.description')}
        </p>

        {/* Back home button */}
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-accent text-on-accent rounded-lg hover:bg-accent transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-bg"
        >
          {t('easterEggs.notFound.backHome')}
        </Link>

        {/* Easter egg hint */}
        <p className="mt-12 text-sm text-fg-muted opacity-50 font-mono">
          {t('easterEggs.notFound.hint')}
        </p>
      </div>
    </div>
  );
}
