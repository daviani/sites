import { ImageResponse } from 'next/og';
import { NORD_1, NORD_6 } from '@nordic-island/ui';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
      >
        <rect width="100" height="100" fill={NORD_1} rx="8" />
        <g fill={NORD_6}>
          <path d="M50 8 L35 25 L30 22 L32 35 L25 38 L30 48 L20 55 L35 58 L35 75 L50 92 L65 75 L65 58 L80 55 L70 48 L75 38 L68 35 L70 22 L65 25 Z" />
          <circle cx="42" cy="45" r="8" fill={NORD_1} />
          <circle cx="58" cy="45" r="8" fill={NORD_1} />
          <circle cx="40" cy="43" r="3" fill={NORD_6} />
          <circle cx="56" cy="43" r="3" fill={NORD_6} />
          <path d="M40 60 L50 55 L60 60 L60 72 L50 80 L40 72 Z" fill={NORD_1} />
          <path d="M46 62 L50 60 L54 62 L54 68 L50 72 L46 68 Z" fill={NORD_6} />
        </g>
      </svg>
    ),
    {
      ...size,
    }
  );
}
