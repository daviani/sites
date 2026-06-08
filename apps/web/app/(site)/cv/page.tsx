import type { Metadata } from 'next';
import CvPageClient from './CvPageClient';

export const metadata: Metadata = {
  title: 'CV',
};

export default function CvPage() {
  return <CvPageClient />;
}
