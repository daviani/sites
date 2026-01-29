import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
