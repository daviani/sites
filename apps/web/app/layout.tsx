import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@daviani/ui";
import { Providers } from "@/components/Providers";
import { HeaderNav } from "@/components/HeaderNav";
import { SubHeaderNav } from "@/components/SubHeaderNav";
import { getSubdomainUrl } from "@/lib/domains/config";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Daviani Fillatre",
  description: "Portfolio multi-tenant avec Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <HeaderNav />
          <SubHeaderNav />
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 pt-[86px] md:pt-[150px] px-[10px]">{children}</main>
            <Footer
              legalUrl={getSubdomainUrl("legal")}
              contactUrl={getSubdomainUrl("contact")}
              githubUrl="https://github.com/daviani"
            />
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
