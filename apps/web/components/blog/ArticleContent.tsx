'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useLanguage } from '@/hooks/use-language';
import type { Article } from '@/lib/content/blog';

interface ArticleContentProps {
  article: Article;
  bodyFr: ReactNode;
  bodyEn: ReactNode | null;
}

export function ArticleContent({ article, bodyFr, bodyEn }: ArticleContentProps) {
  const { language, mounted } = useLanguage();
  const { meta } = article;

  // Use French as fallback during SSR and when English content is not available
  const isEnglish = mounted && language === 'en';
  const title = isEnglish ? meta.titleEn : meta.titleFr;
  const excerpt = isEnglish ? meta.excerptEn : meta.excerptFr;
  const dateLocale = isEnglish ? 'en-US' : 'fr-FR';
  const body = isEnglish && bodyEn ? bodyEn : bodyFr;

  return (
    <>
      {/* Header */}
      <header className="mb-10 p-8 glass-card">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-nord-0 dark:text-nord-6">
          {title}
        </h1>
        <p className="text-lg text-nord-3 dark:text-nord-4 mb-6 leading-relaxed">{excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-nord-3 dark:text-nord-4">
          <time dateTime={meta.publishedAt}>
            {new Date(meta.publishedAt).toLocaleDateString(dateLocale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        {meta.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-4 py-1.5 bg-nord-10/10 dark:bg-nord-8/10 text-nord-10 dark:text-nord-8 rounded-full text-sm font-medium hover:bg-nord-10/20 dark:hover:bg-nord-8/20 transition-colors cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content (pre-rendered on the server with Shiki highlighting) */}
      <div className="mt-8 p-8 glass-card">
        <div className="prose prose-nord dark:prose-invert max-w-none">{body}</div>
      </div>
    </>
  );
}
