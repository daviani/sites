import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@tulikettu/ui';
import Image from 'next/image';
import { MarkdocContent } from '@/lib/markdoc';
import { imageDimensions } from '@/lib/images';
import { getServerTranslations } from '@/lib/i18n/server';
import { getContributionBySlug, getContributionSlugs } from '@/lib/content/projects';
import { pageMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getContributionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getContributionBySlug(slug);
  if (!c) return { title: 'Contribution' };
  return pageMetadata({
    title: c.titleFr,
    description: c.descriptionFr || `${c.titleFr} — contribution open-source de Daviani Fillatre.`,
    path: `/contributions/${slug}`,
    type: 'article',
  });
}

export default async function ContributionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const c = getContributionBySlug(slug);
  if (!c || !c.hasDetail) notFound();

  const { lang, t } = await getServerTranslations();
  const pick = (fr: string, en: string) => (lang === 'en' && en ? en : fr);
  const body = pick(c.bodyFr, c.bodyEn);
  const description = pick(c.descriptionFr, c.descriptionEn);
  const date = pick(c.date, c.dateEn);
  const coverDims = c.cover ? await imageDimensions(c.cover) : null;

  return (
    <div className="w-[var(--content-width)] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumb
        items={[
          { href: '/projets', label: t('nav.projects.title') },
          { href: `/contributions/${slug}`, label: pick(c.titleFr, c.titleEn) },
        ]}
        homeLabel={t('common.home')}
        ariaLabel={t('common.breadcrumb')}
      />

      <header className="mt-6 mb-8 max-w-[65ch]">
        {date && (
          <div className="font-mono text-xs uppercase tracking-[0.08em] text-fg-subtle mb-3">{date}</div>
        )}
        <h1 className="text-[clamp(34px,4.5vw,52px)] font-extrabold tracking-[-0.03em] leading-[1.05] text-fg">
          {pick(c.titleFr, c.titleEn)}
        </h1>
        {description && (
          <p className="text-[19px] text-fg-muted leading-[1.6] mt-4">{description}</p>
        )}
      </header>

      {c.cover && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-surface-hi/55">
          {coverDims ? (
            <Image
              src={c.cover}
              alt={pick(c.titleFr, c.titleEn)}
              width={coverDims.width}
              height={coverDims.height}
              sizes="(max-width: 768px) 100vw, 720px"
              className="block h-auto w-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.cover}
              alt={pick(c.titleFr, c.titleEn)}
              loading="lazy"
              className="block w-full"
            />
          )}
        </div>
      )}

      {c.links.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10">
          {c.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-xl text-sm font-semibold bg-accent text-on-accent hover:brightness-110 hover:-translate-y-px transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              {pick(l.label, l.labelEn)}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}

      {body && (
        <div className="prose-tuli max-w-[65ch]">
          <MarkdocContent content={body} />
        </div>
      )}
    </div>
  );
}
