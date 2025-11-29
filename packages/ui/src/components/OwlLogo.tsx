'use client';

import { useTheme } from '../hooks/use-theme';
import { useEffect, useState, useRef } from 'react';

interface OwlLogoProps {
  size?: number;
  className?: string;
}

export function OwlLogo({ size = 32, className = '' }: OwlLogoProps) {
  const { theme, mounted } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const lastTheme = useRef<string | null>(null);

  useEffect(() => {
    if (!mounted) return;

    // First time mounted is true - initialize lastTheme without animating
    if (lastTheme.current === null) {
      lastTheme.current = theme;
      return;
    }

    // Only animate on actual user-triggered theme changes
    if (lastTheme.current !== theme) {
      lastTheme.current = theme;
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [theme, mounted]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${isAnimating ? 'animate-bounce' : ''} ${className}`}
      style={{ animationDuration: '0.6s', animationIterationCount: 1 }}
      aria-hidden="true"
    >
      <g className="fill-nord-3 dark:fill-nord-4 transition-colors duration-300">
        <path d="M50 8 L35 25 L30 22 L32 35 L25 38 L30 48 L20 55 L35 58 L35 75 L50 92 L65 75 L65 58 L80 55 L70 48 L75 38 L68 35 L70 22 L65 25 Z" />
        <circle cx="42" cy="45" r="8" className="fill-nord-6 dark:fill-nord-0 transition-colors duration-300" />
        <circle cx="58" cy="45" r="8" className="fill-nord-6 dark:fill-nord-0 transition-colors duration-300" />
        <circle cx="40" cy="43" r="3" />
        <circle cx="56" cy="43" r="3" />
        <path d="M40 60 L50 55 L60 60 L60 72 L50 80 L40 72 Z" className="fill-nord-6 dark:fill-nord-0 transition-colors duration-300" />
        <path d="M46 62 L50 60 L54 62 L54 68 L50 72 L46 68 Z" />
      </g>
    </svg>
  );
}
