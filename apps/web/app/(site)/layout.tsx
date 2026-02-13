import { Footer, SkipLink, ScrollToTop } from "@daviani/ui";
import { Providers } from "@/components/Providers";
import { HeaderNav } from "@/components/HeaderNav";
import { SubHeaderNav } from "@/components/SubHeaderNav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SkipLink />
      <HeaderNav />
      <SubHeaderNav />
      <div className="min-h-screen flex flex-col">
        <main
          id="main-content"
          className="flex-1 pt-[var(--height-header-offset)] md:pt-[var(--height-full-offset)] px-[var(--spacing-edge)] pb-8"
        >
          {children}
        </main>
        <ScrollToTop />
        <Footer
          legalUrl="/legal"
          accessibilityUrl="/accessibility"
          githubUrl="https://github.com/daviani"
          linkedinUrl="https://linkedin.com/in/daviani"
          sitemapUrl="/sitemap"
          helpUrl="/help"
        />
      </div>
    </Providers>
  );
}
