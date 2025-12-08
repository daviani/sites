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
    <div className="min-h-screen">
      <article className="max-w-3xl mx-auto px-4 pt-5 pb-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[{ href: '/blog', labelKey: 'nav.blog.title' }]}
            currentLabel={meta.title}
          />
        </div>

        {/* Header */}
        <header className="mb-10 p-8 bg-white/40 dark:bg-nord-3/50 backdrop-blur-md rounded-[2.5rem] shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-nord-0 dark:text-nord-6">
            {meta.title}
          </h1>
          <p className="text-lg text-nord-3 dark:text-nord-4 mb-6 leading-relaxed">
            {meta.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-nord-3 dark:text-nord-4">
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
            <div className="mt-5 flex flex-wrap gap-2">
              {meta.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${tag}`}
                  className="px-4 py-1.5 bg-nord-10/10 dark:bg-nord-8/10 text-nord-10 dark:text-nord-8 rounded-full text-sm font-medium hover:bg-nord-10/20 dark:hover:bg-nord-8/20 transition-colors cursor-pointer"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="mt-8 p-8 bg-white/40 dark:bg-nord-3/50 backdrop-blur-md rounded-[2.5rem] shadow-lg">
          <div className="prose-nord">
            <Content />
          </div>
        </div>

        {/* Comments */}
        <Comments />
      </article>
    </div>
  );
}
