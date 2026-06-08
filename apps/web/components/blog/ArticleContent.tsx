'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { MarkdocContent } from '@/lib/markdoc';
import type { Article } from '@/lib/content/blog';

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  const { language, mounted } = useLanguage();
  const { meta, content, contentEn } = article;

  // Use French as fallback during SSR and when English content is not available
  const isEnglish = mounted && language === 'en';
  const title = isEnglish ? meta.titleEn : meta.titleFr;
  const excerpt = isEnglish ? meta.excerptEn : meta.excerptFr;
  const articleContent = isEnglish && contentEn ? contentEn : content;
  const dateLocale = isEnglish ? 'en-US' : 'fr-FR';

  return (
    <>
      {/* Header */}
      <header className="mb-10 p-8 glass-card">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-fg">
          {title}
        </h1>
        <p className="text-lg text-fg-muted mb-6 leading-relaxed">{excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-fg-muted">
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
                href={`/?tag=${tag}`}
                className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="mt-8 p-8 glass-card">
        <div className="prose prose-tuli max-w-none">
          <MarkdocContent content={articleContent} />
        </div>
      </div>
    </>
  );
}