import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../globals.css";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSocialLinks } from "@/sanity/lib/get-site-settings";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const socialLinks = await getSocialLinks();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full scroll-smooth antialiased motion-reduce:scroll-auto"
    >
      <body className="min-h-full flex flex-col">
        <Header socialLinks={socialLinks} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
