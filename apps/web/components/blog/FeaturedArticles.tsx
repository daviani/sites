'use client';

import Link from 'next/link';
import { Tag } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/hooks/use-language';
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
      <Link href={`/blog/${article.slug}`} className="block group">
        <article className="bg-[linear-gradient(120deg,var(--tuli-surface),var(--tuli-bg))] border border-surface-hi/55 border-l-[3px] border-l-accent rounded-3xl p-9 md:p-10 transition-colors duration-300 hover:border-surface-hi">
          <span className="inline-flex items-center gap-[7px] px-[13px] py-[5px] rounded-full text-xs font-semibold text-accent bg-[color-mix(in_oklab,var(--tuli-accent)_16%,transparent)]">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t('blog.featured')}
          </span>

          <h2 className="text-[clamp(28px,3.4vw,40px)] font-bold tracking-[-0.025em] leading-[1.12] mt-[18px] text-fg group-hover:text-accent transition-colors max-w-[20ch]">
            {title}
          </h2>

          <p className="text-[16.5px] text-fg-muted leading-[1.7] mt-4 max-w-[60ch]">{excerpt}</p>

          <div className="flex flex-wrap items-center gap-3 my-[22px] text-[13px] text-fg-subtle">
            <time dateTime={article.meta.publishedAt}>
              {new Date(article.meta.publishedAt).toLocaleDateString(dateLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}
            </time>

            {article.meta.tags.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                {article.meta.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </>
            )}
          </div>

          <span className="inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all">
            {t('blog.readArticle')}
            <span className="text-fire" aria-hidden="true">→</span>
          </span>
        </article>
      </Link>
    </section>
  );
}