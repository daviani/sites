import { SVGProps } from 'react';

interface FlagProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function FlagFR({ size = 24, className, ...props }: FlagProps) {
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
        <clipPath id="circle-fr">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>

      <g clipPath="url(#circle-fr)">
        {/* Blue - Nord Frost */}
        <rect x="0" y="0" width="67" height="200" fill="#5E81AC" />
        {/* White - Nord Snow */}
        <rect x="67" y="0" width="66" height="200" fill="#ECEFF4" />
        {/* Red - Nord Aurora */}
        <rect x="133" y="0" width="67" height="200" fill="#BF616A" />
      </g>
    </svg>
  );
}

export function FlagEN({ size = 24, className, ...props }: FlagProps) {
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
        <clipPath id="circle-uk">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>

      <g clipPath="url(#circle-uk)">
        {/* White background - Nord Snow */}
        <circle cx="100" cy="100" r="100" fill="#ECEFF4" />

        {/* Diagonal stripes */}
        <path
          d="M0 0 L200 200 M200 0 L0 200"
          stroke="#5E81AC"
          strokeWidth="30"
          fill="none"
        />
        <path
          d="M0 0 L200 200 M200 0 L0 200"
          stroke="#BF616A"
          strokeWidth="10"
          fill="none"
        />

        {/* Cross background */}
        <rect x="80" y="0" width="40" height="200" fill="#ECEFF4" />
        <rect x="0" y="80" width="200" height="40" fill="#ECEFF4" />

        {/* Blue cross - Nord Frost */}
        <rect x="85" y="0" width="30" height="200" fill="#5E81AC" />
        <rect x="0" y="85" width="200" height="30" fill="#5E81AC" />

        {/* Red cross - Nord Aurora */}
        <rect x="90" y="0" width="20" height="200" fill="#BF616A" />
        <rect x="0" y="90" width="200" height="20" fill="#BF616A" />
      </g>
    </svg>
  );
}
