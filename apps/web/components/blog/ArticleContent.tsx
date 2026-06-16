'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { readingMinutes } from '@/lib/reading-time';
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
  const takeaways = isEnglish ? meta.keyTakeawaysEn : meta.keyTakeawaysFr;
  const minutes = readingMinutes(
    isEnglish && article.contentEn ? article.contentEn : article.content,
    isEnglish ? 'en' : 'fr'
  );

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
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {minutes} {isEnglish ? 'min read' : 'min de lecture'}
          </span>
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

      {takeaways.length > 0 && (
        <details open className="mb-8 p-6 glass-card border-l-4 border-fire">
          <summary className="cursor-pointer text-sm font-mono uppercase tracking-wide text-fire">
            {isEnglish ? 'Key takeaways' : 'Ce qu’il faut retenir'}
          </summary>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-fg-muted leading-relaxed">
            {takeaways.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ol>
          <p className="mt-4 text-xs italic text-fg-subtle">
            {isEnglish ? 'AI-generated summary' : 'Résumé généré par IA'}
          </p>
        </details>
      )}

      {/* Content (pré-rendu serveur avec Shiki) : conteneur large, corps borné ~75ch. */}
      <div className="mt-8 p-8 glass-card">
        <div className="prose prose-tuli max-w-prose mx-auto">{body}</div>
      </div>
    </>
  );
}
