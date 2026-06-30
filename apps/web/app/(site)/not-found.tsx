import type { Metadata } from 'next';
import { NotFoundContent } from './NotFoundContent';

/**
 * Metadata de la page 404 (Server Component, donc `metadata` exportable —
 * `not-found.tsx` ne supporte PAS `generateMetadata`, d'où l'export statique).
 * - `robots: noindex` : une page d'erreur ne doit pas être indexée (sinon Google
 *   crée des « soft 404 »). `follow: true` laisse suivre le lien retour accueil.
 * - `canonical: null` : annule le canonical `/` hérité du layout racine, qui
 *   sinon ferait pointer toutes les 404 vers l'accueil (faux signal de qualité).
 */
export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return <NotFoundContent />;
}
