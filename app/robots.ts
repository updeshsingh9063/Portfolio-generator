import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/portfolio/seo";

export default function robots(): MetadataRoute.Robots {
  const base = appUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/editor", "/create", "/api/", "/login", "/signup"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
