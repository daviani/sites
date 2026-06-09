import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Une idée de projet, une question ou une opportunité ? Contactez-moi, je réponds rapidement.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactPageClient />;
}
