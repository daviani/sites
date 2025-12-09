'use client';

import { useTranslation, Breadcrumb } from '@daviani/ui';

export default function PhotosPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/photos', labelKey: 'nav.photos.title' }]} />
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            Photos
          </h1>
          <p className="text-nord-3 dark:text-nord-4">
            Page en construction
          </p>
        </div>
      </div>
    </div>
  );
}