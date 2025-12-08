import Link from 'next/link';
import { getAllArticles, getAllTags } from '@/lib/content/blog';
import { Breadcrumb } from '@daviani/ui';
import { RssButton } from '@/components/blog/RssButton';

const PAGE_SIZE = 20;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const tag = params.tag;

  const allArticles = getAllArticles();
  const filteredArticles = tag
    ? allArticles.filter((a) => a.meta.tags.includes(tag))
    : allArticles;

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

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                !tag
                  ? 'bg-nord-10 text-white'
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
                    ? 'bg-nord-10 text-white'
                    : 'bg-nord-5 dark:bg-nord-2 text-nord-0 dark:text-nord-4 hover:bg-nord-4 dark:hover:bg-nord-3'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Articles list */}
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
                    {article.meta.title}
                  </h2>
                  <p className="text-nord-0 dark:text-nord-4 mb-4">
                    {article.meta.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-nord-0 dark:text-nord-4">
                    <time dateTime={article.meta.date}>
                      {new Date(article.meta.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    {article.meta.readingTime && (
                      <span>· {article.meta.readingTime}</span>
                    )}
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
