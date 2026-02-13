'use client';

import { Footer, SkipLink, ScrollToTop } from "@nordic-island/ui";
import { Providers } from "@/components/Providers";
import { HeaderNav } from "@/components/HeaderNav";
import { SubHeaderNav } from "@/components/SubHeaderNav";
import { useTranslation } from "@/hooks/use-translation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SiteLayoutContent>{children}</SiteLayoutContent>
    </Providers>
  );
}

function SiteLayoutContent({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <>
      <SkipLink label={t('common.skipToContent')} />
      <HeaderNav />
      <SubHeaderNav />
      <div className="min-h-screen flex flex-col">
        <main
          id="main-content"
          className="flex-1 pt-[var(--height-header-offset)] md:pt-[var(--height-full-offset)] px-[var(--spacing-edge)] pb-8"
        >
          {children}
        </main>
        <ScrollToTop ariaLabel={t('common.scrollToTop')} />
        <Footer
          legalUrl="/legal"
          accessibilityUrl="/accessibility"
          githubUrl="https://github.com/daviani"
          linkedinUrl="https://linkedin.com/in/daviani"
          sitemapUrl="/sitemap"
          helpUrl="/help"
          translations={{
            legalNotice: t('footer.legalNotice'),
            github: t('footer.github'),
            linkedin: t('footer.linkedin'),
            copyright: t('footer.copyright'),
            navigation: t('footer.navigation'),
            infos: t('footer.infos'),
            links: t('footer.links'),
            sitemap: t('nav.sitemap.title'),
            help: t('nav.help.title'),
            accessibility: t('nav.accessibility.title'),
          }}
        />
      </div>
    </>
  );
}
