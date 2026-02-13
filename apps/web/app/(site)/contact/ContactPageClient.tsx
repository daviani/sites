'use client';

import { Breadcrumb } from '@nordic-island/ui';
import { useTranslation } from '@/hooks/use-translation';
import { ContactForm } from '@/components/ContactForm';
import { submitContactForm } from './actions';

export default function ContactPageClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/contact', label: t('nav.contact.title') }]} homeLabel={t('common.home')} ariaLabel={t('common.breadcrumb')} />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {t('pages.contact.title')}
          </h1>
          <p className="text-xl text-nord-3 dark:text-nord-4">
            {t('contact.intro')}
          </p>
        </div>

        <ContactForm onSubmit={submitContactForm} />

        <p className="text-center text-sm text-nord-3 dark:text-nord-4 mt-8">
          {t('contact.fallback')}
        </p>
      </div>
    </div>
  );
}
