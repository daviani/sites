'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme, useTranslation } from '@daviani/ui';

const Giscus = dynamic(() => import('@giscus/react').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-8">
      <div className="animate-pulse text-nord-3 dark:text-nord-4">Chargement des commentaires...</div>
    </div>
  ),
});

export function Comments() {
  const [hasConsent, setHasConsent] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!hasConsent) {
    return (
      <section className="mt-8 p-8 bg-white/40 dark:bg-nord-3/50 backdrop-blur-md rounded-[2.5rem] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-nord-0 dark:text-nord-6">
          {t('comments.title')}
        </h2>
        <p className="text-nord-3 dark:text-nord-4 mb-4">
          {t('comments.consentText')}
        </p>
        <p className="text-sm text-nord-3 dark:text-nord-4 mb-6">
          {t('comments.privacyNote')}
        </p>
        <button
          onClick={() => setHasConsent(true)}
          className="px-6 py-3 bg-nord-btn text-white rounded-full font-semibold hover:bg-nord-btn-hover hover:scale-105 transition-all cursor-pointer"
        >
          {t('comments.acceptButton')}
        </button>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <Giscus
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY!}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === 'dark' ? 'dark_dimmed' : 'light'}
        lang="fr"
        loading="lazy"
      />
    </section>
  );
}
