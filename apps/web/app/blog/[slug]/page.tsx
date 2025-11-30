import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticles, getArticleBySlug } from '@/lib/content/blog';
import { Comments } from '@/components/blog/Comments';
import { Breadcrumb } from '@daviani/ui';
import type { Metadata } from 'next';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article non trouvé' };
  }

  const ogImageUrl = `/api/og/${slug}`;

  return {
    title: article.meta.title,
    description: article.meta.description,
    openGraph: {
      title: article.meta.title,
      description: article.meta.description,
      type: 'article',
      publishedTime: article.meta.date,
      tags: article.meta.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta.title,
      description: article.meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Dynamic import of MDX content
  let Content: React.ComponentType;
  try {
    const mdxModule = await import(`@/content/blog/${slug}.mdx`);
    Content = mdxModule.default;
  } catch {
    notFound();
  }

  const { meta } = article;

  return (
    <div className="min-h-screen bg-nord6 dark:bg-nord0">
      <article className="max-w-3xl mx-auto px-4 pt-5 pb-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[{ href: '/blog', labelKey: 'nav.blog.title' }]}
            currentLabel={meta.title}
          />
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {meta.title}
          </h1>
          <p className="text-xl text-nord-0 dark:text-nord-4 mb-4">
            {meta.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-nord-0 dark:text-nord-4">
            <time dateTime={meta.date}>
              {new Date(meta.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {meta.readingTime && <span>· {meta.readingTime}</span>}
            {meta.lang && <span>· {meta.lang.toUpperCase()}</span>}
          </div>
          {meta.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${tag}`}
                  className="px-3 py-1 bg-nord-5 dark:bg-nord-2 text-nord-0 dark:text-nord-4 rounded-full text-sm hover:bg-nord-4 dark:hover:bg-nord-3 transition-colors cursor-pointer"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose-nord">
          <Content />
        </div>

        {/* Comments */}
        <Comments slug={slug} />
      </article>
    </div>
  );
}
