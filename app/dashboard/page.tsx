import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { portfolioDataSchema } from "@/lib/portfolio/schema";
import { getTemplate } from "@/components/portfolio/registry";
import { DashboardClient, type PortfolioSummary } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");
  const userId = session.user.id;

  const rows = await prisma.portfolio.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const portfolios: PortfolioSummary[] = rows.map((p) => {
    const parsed = portfolioDataSchema.safeParse(p.content);
    const profile = parsed.success ? parsed.data.profile : undefined;
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      published: p.published,
      views: p.views,
      updatedAt: p.updatedAt.toISOString(),
      templateName: getTemplate(p.templateId).name,
      name: profile?.fullName || "Untitled",
      headline: profile?.headline || "",
      avatar: profile?.avatar?.startsWith("http") ? profile.avatar : undefined,
    };
  });

  const totalViews = portfolios.reduce((a, p) => a + p.views, 0);
  const published = portfolios.filter((p) => p.published).length;

  const deviceGroups = await prisma.analyticsEvent.groupBy({
    by: ["device"],
    where: { portfolio: { userId }, type: "view" },
    _count: { _all: true },
  });
  const devices = { desktop: 0, tablet: 0, mobile: 0 };
  for (const g of deviceGroups) {
    const key = (g.device ?? "desktop") as keyof typeof devices;
    if (key in devices) devices[key] += g._count._all;
  }

  return (
    <DashboardClient
      userName={session.user.name || session.user.email || "there"}
      portfolios={portfolios}
      stats={{ total: portfolios.length, published, totalViews }}
      devices={devices}
    />
  );
}
