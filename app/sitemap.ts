import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = ["/"];

  return publicRoutes.map((path) => ({
    url: new URL(path, siteConfig.url).href,
  }));
}
