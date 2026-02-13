import { SVGProps, useId } from 'react';

interface FlagProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function FlagFR({ size = 24, className, ...props }: FlagProps) {
  const clipId = useId();

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
  const clipId = useId();

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
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Blue background - Nord Frost (darker for visibility) */}
        <circle cx="100" cy="100" r="96" fill="#5E81AC" />

        {/* White diagonal stripes */}
        <path
          d="M0 0 L200 200 M200 0 L0 200"
          stroke="#ECEFF4"
          strokeWidth="35"
          fill="none"
        />

        {/* Red diagonal stripes (thinner, on top) */}
        <path
          d="M0 0 L200 200 M200 0 L0 200"
          stroke="#BF616A"
          strokeWidth="12"
          fill="none"
        />

        {/* White cross */}
        <rect x="75" y="0" width="50" height="200" fill="#ECEFF4" />
        <rect x="0" y="75" width="200" height="50" fill="#ECEFF4" />

        {/* Red cross - Nord Aurora */}
        <rect x="88" y="0" width="24" height="200" fill="#BF616A" />
        <rect x="0" y="88" width="200" height="24" fill="#BF616A" />
      </g>

      {/* Border circle for visibility */}
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="#4C566A"
        strokeWidth="4"
        opacity="0.5"
      />
    </svg>
  );
}
