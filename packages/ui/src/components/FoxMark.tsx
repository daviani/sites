import type { SVGProps } from 'react';

/**
 * Signet Tulikettu en SVG vectoriel (net à petite taille, contrairement au PNG
 * « logo classique » du FoxLogo). Géométrie d'icon.svg ; couleurs theme-aware :
 * orange de marque fixe, face (--tuli-mark-fg) et détails (--fox-detail) basculent
 * en Päivä/Kaamos pour rester contrastés sur le header clair comme sombre.
 * Décoratif → aria-hidden (le lien parent porte le libellé). Dimensionner via className.
 */
export function FoxMark({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="56 34 1140 1140"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <polygon
        points="215,140 291,508 256,672 319,746 384,826 447,906 519,986 555,1026 629,1068 612,1000 602,735 598,595 594,450"
        fill="#FF6E07"
      />
      <polygon
        points="629,1068 650,1000 652,770 656,595 659,455 1038,140 967,508 999,666 935,746 874,826 807,906 738,986 642,1066"
        fill="var(--tuli-mark-fg)"
      />
      <polygon
        points="594,450 598,595 602,735 606,860 609,945 611,985 580,1007 588,1027 605,1051 631,1069 657,1051 674,1027 685,1007 650,985 651,910 656,770 659,595 659,455"
        fill="var(--fox-detail)"
      />
      <polygon points="363,644 483,698 524,781 411,735" fill="var(--fox-detail)" />
      <polygon points="771,701 895,646 849,733 731,783" fill="var(--fox-detail)" />
      <polygon
        points="476,842 484,860 498,884 511,907 520,931 527,967 531,991 533,1003 513,979 501,955 492,919 483,883 477,859"
        fill="var(--fox-detail)"
      />
      <polygon
        points="776,851 768,863 757,881 748,899 740,917 735,941 730,965 726,989 724,1001 736,989 751,965 758,941 765,911 771,881 774,863"
        fill="var(--fox-detail)"
      />
    </svg>
  );
}
