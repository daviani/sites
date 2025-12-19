import { notFound } from 'next/navigation';
import { getAllArticles, getArticleBySlug } from '@/lib/content/blog';
import { Comments } from '@/components/blog/Comments';
import { ArticleContent } from '@/components/blog/ArticleContent';
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
    title: article.meta.titleFr,
    description: article.meta.excerptFr,
    openGraph: {
      title: article.meta.titleFr,
      description: article.meta.excerptFr,
      type: 'article',
      publishedTime: article.meta.publishedAt,
      tags: article.meta.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.meta.titleFr,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta.titleFr,
      description: article.meta.excerptFr,
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

  return (
    <div className="min-h-screen">
      <article className="max-w-3xl mx-auto px-4 pt-5 pb-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[{ href: '/blog', labelKey: 'nav.blog.title' }]}
            currentLabel={article.meta.titleFr}
          />
        </div>

        {/* Article content with i18n support */}
        <ArticleContent article={article} />

        {/* Comments */}
        <Comments />
      </article>
    </div>
  );
}
