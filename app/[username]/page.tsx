import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { portfolioDataSchema, type PortfolioData } from "@/lib/portfolio/schema";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { ViewTracker } from "@/components/portfolio/ViewTracker";
import { buildPortfolioMetadata, personJsonLd } from "@/lib/portfolio/seo";

export const revalidate = 60;

const getPortfolio = cache(async (slug: string): Promise<{ id: string; data: PortfolioData } | null> => {
  const rec = await prisma.portfolio.findFirst({
    where: { slug: slug.toLowerCase(), published: true },
  });
  if (!rec) return null;
  const parsed = portfolioDataSchema.safeParse(rec.content);
  if (!parsed.success) return null;
  return { id: rec.id, data: parsed.data };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const p = await getPortfolio(username);
  if (!p) return { title: "Portfolio not found", robots: { index: false, follow: false } };
  return buildPortfolioMetadata(p.data, username);
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const p = await getPortfolio(username);
  if (!p) notFound();

  const jsonLd = personJsonLd(p.data, username);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker portfolioId={p.id} />
      <PortfolioRenderer data={p.data} />
    </>
  );
}
