import type { Metadata } from "next";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { sampleData } from "@/lib/portfolio/sample";

const { profile } = sampleData;

export const metadata: Metadata = {
  title: `${profile.fullName} — ${profile.headline}`,
  description: profile.bio,
};

export default function PreviewPage() {
  return <PortfolioRenderer data={sampleData} />;
}
