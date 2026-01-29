import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Accueil',
};

export default function HomePage() {
  return <HomePageClient />;
}
