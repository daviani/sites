'use client';

import { useState } from 'react';
import Giscus from '@giscus/react';
import { useTheme, useTranslation } from '@daviani/ui';

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
          className="px-6 py-3 bg-nord-10 text-white rounded-full font-semibold hover:bg-nord-9 hover:scale-105 transition-all cursor-pointer"
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
