import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getAllTags, getFeaturedArticles } from '@/lib/content/blog';
import { Breadcrumb, Tag } from '@tulikettu/ui';
import { RssButton } from '@/components/blog/RssButton';
import { FeaturedArticle } from '@/components/blog/FeaturedArticles';
import { pageMetadata, blogCollectionJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Blog',
  description:
    "Articles sur le développement web, le DevOps, Swift/iOS et l'ingénierie logicielle.",
  path: '/blog',
});

const PAGE_SIZE = 20;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const tag = params.tag;

  const allArticles = getAllArticles();
  const featuredArticles = getFeaturedArticles();

  // Only show the most recent featured article (first one, already sorted by date)
  const featuredArticle = featuredArticles[0] ?? null;

  // Show featured section only on first page without tag filter
  const showFeatured = page === 1 && !tag && featuredArticle !== null;

  // Filter articles: exclude the featured article from main list when showing it
  const nonFeaturedArticles = showFeatured
    ? allArticles.filter((a) => a.slug !== featuredArticle.slug)
    : allArticles;

  const filteredArticles = tag
    ? allArticles.filter((a) => a.meta.tags.includes(tag))
    : nonFeaturedArticles;

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const articles = filteredArticles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allTags = getAllTags();

  return (
    <div>
      <JsonLd
        data={blogCollectionJsonLd(
          allArticles.map((a) => ({
            title: a.meta.titleFr,
            slug: a.slug,
            publishedAt: a.meta.publishedAt,
            description: a.meta.excerptFr,
          })),
        )}
      />
      <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumb items={[{ href: '/blog', label: 'Blog' }]} homeLabel="Accueil" ariaLabel="Fil d'Ariane" />

        <div className="text-center pt-[54px] pb-9">
          <span className="inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent mb-3.5">
            Journal
          </span>
          <h1 className="text-[clamp(40px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.02] text-fg">
            Blog
          </h1>
          <p className="text-[17px] text-fg-muted mt-3.5 max-w-[54ch] mx-auto">
            Articles sur le développement web, DevOps et plus encore.
          </p>
          <div className="mt-[22px] flex justify-center">
            <RssButton />
          </div>
        </div>

        {/* Featured article hero section */}
        {showFeatured && featuredArticle && <FeaturedArticle article={featuredArticle} />}

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`px-[13px] py-[5px] rounded-full font-mono text-xs border transition-colors cursor-pointer ${
                !tag
                  ? 'bg-accent text-on-accent border-transparent'
                  : 'bg-surface-el text-fg-muted border-surface-hi/55 hover:border-surface-hi hover:text-fg'
              }`}
            >
              Tous
            </Link>
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${t}`}
                className={`px-[13px] py-[5px] rounded-full font-mono text-xs border transition-colors cursor-pointer ${
                  tag === t
                    ? 'bg-accent text-on-accent border-transparent'
                    : 'bg-surface-el text-fg-muted border-surface-hi/55 hover:border-surface-hi hover:text-fg'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Articles list */}
        {showFeatured && articles.length > 0 && (
          <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-6 mt-[30px]">
            Tous les articles
          </h2>
        )}
        {articles.length === 0 ? (
          <p className="text-fg-muted">Aucun article trouvé.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group grid grid-cols-1 sm:grid-cols-[110px_1fr_auto] gap-x-6 gap-y-2 items-center bg-surface border border-surface-hi/55 rounded-2xl px-[26px] py-[22px] hover:border-surface-hi hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <time
                  dateTime={article.meta.publishedAt}
                  className="font-mono text-xs text-fg-subtle leading-[1.5]"
                >
                  {new Date(article.meta.publishedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    timeZone: 'UTC',
                  })}
                  <br />
                  {new Date(article.meta.publishedAt).getFullYear()}
                </time>
                <div>
                  <h3 className="text-[19px] font-bold tracking-[-0.01em] text-fg group-hover:text-accent transition-colors">
                    {article.meta.titleFr}
                  </h3>
                  <p className="text-sm text-fg-muted mt-[5px] leading-[1.55]">
                    {article.meta.excerptFr}
                  </p>
                  {article.meta.tags.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {article.meta.tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </div>
                <span
                  className="hidden sm:block text-fire text-xl group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex justify-center items-center gap-2">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}${tag ? `&tag=${tag}` : ''}`}
                className="px-4 py-2 rounded-lg bg-surface border border-surface-hi/55 text-fg-muted hover:border-surface-hi hover:text-fg transition-colors cursor-pointer"
              >
                ← Précédent
              </Link>
            )}
            <span className="px-4 py-2 font-mono text-sm text-fg-subtle">
              Page {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}${tag ? `&tag=${tag}` : ''}`}
                className="px-4 py-2 rounded-lg bg-surface border border-surface-hi/55 text-fg-muted hover:border-surface-hi hover:text-fg transition-colors cursor-pointer"
              >
                Suivant →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
