import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'À propos',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
