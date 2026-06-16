import type { Metadata } from 'next';
import CvPageClient from './CvPageClient';
import { pageMetadata, cvPersonJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'CV',
  description:
    'Mon CV : parcours, compétences et expériences en développement full-stack et DevOps, à télécharger en PDF.',
  path: '/cv',
});

export default function CvPage() {
  return (
    <>
      <JsonLd data={cvPersonJsonLd()} />
      <CvPageClient />
    </>
  );
}
