import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { appUrl } from "@/lib/portfolio/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appUrl();

  let portfolios: { slug: string; updatedAt: Date }[] = [];
  try {
    portfolios = await prisma.portfolio.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
  } catch {
    // DB unavailable at build — return the static entries only.
  }

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...portfolios.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
