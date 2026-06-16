'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useLanguage } from '@/hooks/use-language';
import type { Article } from '@/lib/content/blog';

interface ArticleContentProps {
  article: Article;
  /** Corps pré-rendus côté serveur (Markdoc + coloration Shiki). */
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
        <h1 id="article-title" className="text-3xl md:text-4xl font-bold mb-4 text-fg">
          {title}
        </h1>
        <p className="text-lg text-fg-muted mb-6 leading-relaxed">{excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-fg-muted">
          <address className="not-italic">
            {isEnglish ? 'By ' : 'Par '}
            <a
              rel="author"
              href="/about"
              className="font-medium hover:text-accent hover:underline underline-offset-4 transition-colors"
            >
              Daviani Fillatre
            </a>
          </address>
          <time dateTime={meta.publishedAt}>
            {new Date(meta.publishedAt).toLocaleDateString(dateLocale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
        </div>
        {meta.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content (pré-rendu serveur avec Shiki) : conteneur large, corps borné ~75ch. */}
      <div className="mt-8 p-8 glass-card">
        <div className="prose prose-tuli max-w-prose mx-auto">{body}</div>
      </div>
    </>
  );
}
