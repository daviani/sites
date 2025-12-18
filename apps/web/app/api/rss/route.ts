import fs from 'node:fs';
import path from 'node:path';
import { getAllArticles } from '@/lib/content/blog';

interface Translations {
  home: { title: string };
  pages: { blog: { title: string; subtitle: string } };
}

function getTranslations(): Translations {
  const filePath = path.join(process.cwd(), '../../packages/ui/src/locales/fr.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

const SITE_URL =
  (process.env.NEXT_PUBLIC_PROTOCOL || 'https') +
  '://' +
  (process.env.NEXT_PUBLIC_DOMAIN || 'daviani.dev');
const BLOG_URL =
  (process.env.NEXT_PUBLIC_PROTOCOL || 'https') +
  '://blog.' +
  (process.env.NEXT_PUBLIC_DOMAIN || 'daviani.dev');

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const articles = getAllArticles();
  const t = getTranslations();

  const feedTitle = `${t.home.title} - ${t.pages.blog.title}`;
  const feedDescription = t.pages.blog.subtitle;

  const rssItems = articles
    .map((article) => {
      const { meta, slug } = article;
      const articleUrl = `${BLOG_URL}/${slug}`;
      const pubDate = new Date(meta.publishedAt).toUTCString();

      return `
    <item>
      <title>${escapeXml(meta.titleFr)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(meta.excerptFr)}</description>
      <pubDate>${pubDate}</pubDate>
      ${meta.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${BLOG_URL}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/owl-logo.png</url>
      <title>${escapeXml(feedTitle)}</title>
      <link>${BLOG_URL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}