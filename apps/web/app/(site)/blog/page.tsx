import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getAllTags, getFeaturedArticles } from '@/lib/content/blog';
import { Breadcrumb } from '@daviani/ui';
import { RssButton } from '@/components/blog/RssButton';
import { FeaturedArticle } from '@/components/blog/FeaturedArticles';

export const metadata: Metadata = {
  title: 'Blog',
};

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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-16">
        <div className="mb-8">
          <Breadcrumb items={[{ href: '/blog', labelKey: 'nav.blog.title' }]} />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-nord-0 dark:text-nord-6">Blog</h1>
          <p className="text-xl text-nord-3 dark:text-nord-4 mb-6">
            Articles sur le développement web, DevOps et plus encore.
          </p>
          <RssButton />
        </div>

        {/* Featured article hero section */}
        {showFeatured && featuredArticle && <FeaturedArticle article={featuredArticle} />}

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                !tag
                  ? 'bg-nord-btn text-white'
                  : 'bg-nord-5 dark:bg-nord-2 text-nord-0 dark:text-nord-4 hover:bg-nord-4 dark:hover:bg-nord-3'
              }`}
            >
              Tous
            </Link>
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/?tag=${t}`}
                className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                  tag === t
                    ? 'bg-nord-btn text-white'
                    : 'bg-nord-5 dark:bg-nord-2 text-nord-0 dark:text-nord-4 hover:bg-nord-4 dark:hover:bg-nord-3'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Articles list */}
        {showFeatured && articles.length > 0 && (
          <h2 className="text-sm font-semibold text-nord-3 dark:text-nord-4 uppercase tracking-wider mb-6">
            Tous les articles
          </h2>
        )}
        {articles.length === 0 ? (
          <p className="text-nord-0 dark:text-nord-4">Aucun article trouvé.</p>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="p-6 bg-white/40 dark:bg-nord-3/50 backdrop-blur-md rounded-[2.5rem] shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link href={`/${article.slug}`} className="block cursor-pointer">
                  <h2 className="text-2xl font-bold mb-2 text-nord-0 dark:text-nord-6 hover:text-nord-10 dark:hover:text-nord-8 transition-colors">
                    {article.meta.titleFr}
                  </h2>
                  <p className="text-nord-0 dark:text-nord-4 mb-4">
                    {article.meta.excerptFr}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-nord-0 dark:text-nord-4">
                    <time dateTime={article.meta.publishedAt}>
                      {new Date(article.meta.publishedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  {article.meta.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {article.meta.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-nord-5 dark:bg-nord-2 text-nord-0 dark:text-nord-4 rounded text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/?page=${page - 1}${tag ? `&tag=${tag}` : ''}`}
                className="px-4 py-2 bg-nord-5 dark:bg-nord-2 rounded hover:bg-nord-4 dark:hover:bg-nord-3 transition-colors cursor-pointer"
              >
                ← Précédent
              </Link>
            )}
            <span className="px-4 py-2 text-nord-0 dark:text-nord-4">
              Page {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/?page=${page + 1}${tag ? `&tag=${tag}` : ''}`}
                className="px-4 py-2 bg-nord-5 dark:bg-nord-2 rounded hover:bg-nord-4 dark:hover:bg-nord-3 transition-colors cursor-pointer"
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
