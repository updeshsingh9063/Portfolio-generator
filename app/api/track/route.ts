import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Record a portfolio view (increment counter + log an analytics event). */
export async function POST(req: Request) {
  try {
    const { portfolioId, device, referrer, path } = await req.json();
    if (!portfolioId || typeof portfolioId !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const exists = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      select: { id: true, published: true },
    });
    if (!exists?.published) return NextResponse.json({ ok: false }, { status: 404 });

    await prisma.$transaction([
      prisma.portfolio.update({ where: { id: portfolioId }, data: { views: { increment: 1 } } }),
      prisma.analyticsEvent.create({
        data: {
          portfolioId,
          type: "view",
          device: typeof device === "string" ? device.slice(0, 20) : null,
          referrer: typeof referrer === "string" ? referrer.slice(0, 300) : null,
          path: typeof path === "string" ? path.slice(0, 300) : null,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
