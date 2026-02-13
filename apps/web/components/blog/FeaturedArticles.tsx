'use client';

import Link from 'next/link';
import { useTranslation, useLanguage } from '@nordic-island/ui';
import type { Article } from '@/lib/content/blog';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const { t } = useTranslation();
  const { language, mounted } = useLanguage();

  const isEnglish = mounted && language === 'en';
  const title = isEnglish ? article.meta.titleEn : article.meta.titleFr;
  const excerpt = isEnglish ? article.meta.excerptEn : article.meta.excerptFr;
  const dateLocale = isEnglish ? 'en-US' : 'fr-FR';

  return (
    <section className="mb-12">
      <Link href={`/${article.slug}`} className="block group">
        <article className="p-8 md:p-10 bg-gradient-to-br from-nord-10/10 via-transparent to-nord-9/5 dark:from-nord-10/20 dark:via-nord-3/50 dark:to-nord-9/10 backdrop-blur-md rounded-[var(--radius-island)] border-l-4 border-nord-10 shadow-lg hover:shadow-xl transition-all duration-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-nord-btn text-white rounded-full text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t('blog.featured')}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-5 mb-4 text-nord-0 dark:text-nord-6 group-hover:text-nord-10 dark:group-hover:text-nord-8 transition-colors">
            {title}
          </h2>

          <p className="text-lg text-nord-3 dark:text-nord-4 mb-6 max-w-3xl">{excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-nord-3 dark:text-nord-4">
            <time dateTime={article.meta.publishedAt}>
              {new Date(article.meta.publishedAt).toLocaleDateString(dateLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>

            {article.meta.tags.length > 0 && (
              <>
                <span className="text-nord-4 dark:text-nord-3">•</span>
                <div className="flex flex-wrap gap-2">
                  {article.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-nord-5/50 dark:bg-nord-2/50 text-nord-0 dark:text-nord-4 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-nord-10 dark:text-nord-8 font-medium group-hover:gap-3 transition-all">
            {t('blog.readArticle')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </article>
      </Link>
    </section>
  );
}