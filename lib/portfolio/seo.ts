import type { Metadata } from "next";
import type { PortfolioData } from "./schema";

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function portfolioUrl(slug: string): string {
  return `${appUrl()}/${slug}`;
}

/** Per-portfolio metadata: title, description, OG, Twitter, canonical. */
export function buildPortfolioMetadata(data: PortfolioData, slug: string): Metadata {
  const { profile } = data;
  const name = profile.fullName || "Portfolio";
  const title = profile.headline ? `${name} — ${profile.headline}` : name;
  const description =
    profile.bio?.trim() ||
    `Portfolio of ${name}${profile.headline ? `, ${profile.headline}` : ""}.`;
  const url = portfolioUrl(slug);
  const ogImage = profile.avatar?.startsWith("http") ? [profile.avatar] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      siteName: "Folio",
      images: ogImage,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage,
    },
    robots: { index: true, follow: true },
  };
}

/** JSON-LD Person schema for rich results. */
export function personJsonLd(data: PortfolioData, slug: string) {
  const { profile } = data;
  const sameAs = data.socials.map((s) => s.url).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    jobTitle: profile.headline,
    description: profile.bio || profile.about,
    url: portfolioUrl(slug),
    image: profile.avatar || undefined,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: data.skills.flatMap((g) => g.items.map((i) => i.name)).slice(0, 20) || undefined,
  };
}
