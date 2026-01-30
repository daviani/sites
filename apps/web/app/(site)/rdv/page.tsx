import type { Metadata } from 'next';
import RdvPageClient from './RdvPageClient';

export const metadata: Metadata = {
  title: 'Rendez-vous',
};

export default function RdvPage() {
  return <RdvPageClient />;
}
