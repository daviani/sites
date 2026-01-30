import { Footer, SkipLink, ScrollToTop } from "@daviani/ui";
import { Providers } from "@/components/Providers";
import { HeaderNav } from "@/components/HeaderNav";
import { SubHeaderNav } from "@/components/SubHeaderNav";
import { getSubdomainUrl } from "@/lib/domains/config";

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
          className="flex-1 pt-[86px] md:pt-[150px] px-[10px] pb-8"
        >
          {children}
        </main>
        <ScrollToTop />
        <Footer
          legalUrl={getSubdomainUrl("legal")}
          accessibilityUrl={getSubdomainUrl("accessibility")}
          githubUrl="https://github.com/daviani"
          linkedinUrl="https://linkedin.com/in/daviani"
          sitemapUrl={getSubdomainUrl("sitemap")}
          helpUrl={getSubdomainUrl("help")}
        />
      </div>
    </Providers>
  );
}
