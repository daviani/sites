'use client';

import { SVGProps } from 'react';
import { useTheme } from '../../hooks/use-theme';

interface GitHubIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
}

export function GitHubIcon({
  size = 24,
  variant = 'auto',
  className,
  ...props
}: GitHubIconProps) {
  const { theme } = useTheme();

  // Determine which variant to use
  const effectiveVariant =
    variant === 'auto' ? (theme === 'dark' ? 'dark' : 'light') : variant;

  // Nord colors
  const backgroundColor = effectiveVariant === 'dark' ? '#2E3440' : '#ECEFF4';
  const iconColor = effectiveVariant === 'dark' ? '#ECEFF4' : '#2E3440';

  // Unique ID for clipPath to avoid conflicts with multiple instances
  const clipId = `circle-gh-${effectiveVariant}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Background circle */}
        <circle cx="100" cy="100" r="100" fill={backgroundColor} />

        {/* GitHub Octocat silhouette */}
        <path
          fill={iconColor}
          d="M100 20C55.8 20 20 55.8 20 100c0 35.4 22.9 65.4 54.7 76 4 .7 5.5-1.7 5.5-3.9 0-1.9-.1-7-.1-13.7-22.3 4.8-27-10.7-27-10.7-3.6-9.2-8.9-11.7-8.9-11.7-7.3-5 .5-4.9.5-4.9 8 .6 12.3 8.3 12.3 8.3 7.1 12.2 18.7 8.7 23.3 6.6.7-5.2 2.8-8.7 5.1-10.7-17.8-2-36.5-8.9-36.5-39.6 0-8.7 3.1-15.9 8.2-21.5-.8-2-3.6-10.2.8-21.2 0 0 6.7-2.1 22 8.2 6.4-1.8 13.2-2.7 20-2.7 6.8 0 13.6.9 20 2.7 15.3-10.4 22-8.2 22-8.2 4.4 11 1.6 19.2.8 21.2 5.1 5.6 8.2 12.8 8.2 21.5 0 30.8-18.7 37.6-36.6 39.6 2.9 2.5 5.5 7.4 5.5 14.9 0 10.7-.1 19.4-.1 22 0 2.1 1.5 4.6 5.5 3.9C157.1 165.4 180 135.4 180 100c0-44.2-35.8-80-80-80z"
        />
      </g>
    </svg>
  );
}
