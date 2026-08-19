"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { portfolioDataSchema, type PortfolioData } from "@/lib/portfolio/schema";
import {
  validateUsername,
  suggestUsernames,
  USERNAME_ERROR_MESSAGES,
} from "@/lib/portfolio/username";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

/* ------------------------------ username check ---------------------------- */

export type UsernameCheck = {
  available: boolean;
  error?: string;
  suggestions?: string[];
};

export async function checkUsername(
  raw: string,
  excludePortfolioId?: string
): Promise<UsernameCheck> {
  const slug = raw.toLowerCase().trim();
  const format = validateUsername(slug);
  if (!format.ok) {
    return {
      available: false,
      error: USERNAME_ERROR_MESSAGES[format.error],
      suggestions: format.error === "reserved" || format.error === "blocked"
        ? suggestUsernames(slug)
        : undefined,
    };
  }

  const existing = await prisma.portfolio.findUnique({ where: { slug } });
  const takenByOther = existing && existing.id !== excludePortfolioId;

  if (takenByOther) {
    const suggestions = await firstAvailable(suggestUsernames(slug));
    return { available: false, error: "That name is taken.", suggestions };
  }
  return { available: true };
}

async function firstAvailable(candidates: string[]): Promise<string[]> {
  if (candidates.length === 0) return [];
  const taken = new Set(
    (
      await prisma.portfolio.findMany({
        where: { slug: { in: candidates } },
        select: { slug: true },
      })
    ).map((p) => p.slug)
  );
  return candidates.filter((c) => !taken.has(c)).slice(0, 4);
}

/* ------------------------------ save / publish ---------------------------- */

export type SaveResult =
  | { ok: true; id: string; slug: string; url: string; published: boolean }
  | { ok: false; error: string };

async function upsertPortfolio(input: {
  id?: string;
  slug: string;
  data: unknown;
  publish: boolean;
}): Promise<SaveResult> {
  let userId: string;
  try {
    userId = await requireUser();
  } catch {
    return { ok: false, error: "Please sign in to save your portfolio." };
  }

  const parsed = portfolioDataSchema.safeParse(input.data);
  if (!parsed.success) return { ok: false, error: "Some fields are invalid. Please review and try again." };
  const data: PortfolioData = parsed.data;

  const check = await checkUsername(input.slug, input.id);
  if (!check.available) return { ok: false, error: check.error ?? "That username isn't available." };

  const slug = input.slug.toLowerCase().trim();
  const title = data.profile.fullName
    ? `${data.profile.fullName} — ${data.profile.headline}`
    : "Untitled Portfolio";

  // If updating, verify ownership.
  if (input.id) {
    const owned = await prisma.portfolio.findFirst({ where: { id: input.id, userId } });
    if (!owned) return { ok: false, error: "Portfolio not found." };
  }

  const record = await prisma.portfolio.upsert({
    where: { id: input.id ?? "__none__" },
    create: {
      userId,
      slug,
      title,
      templateId: data.settings.templateId,
      content: data as object,
      published: input.publish,
      publishedAt: input.publish ? new Date() : null,
    },
    update: {
      slug,
      title,
      templateId: data.settings.templateId,
      content: data as object,
      ...(input.publish ? { published: true, publishedAt: new Date() } : {}),
    },
  });

  revalidatePath(`/${slug}`);
  return {
    ok: true,
    id: record.id,
    slug: record.slug,
    url: `/${record.slug}`,
    published: record.published,
  };
}

export async function savePortfolio(input: { id?: string; slug: string; data: unknown }) {
  return upsertPortfolio({ ...input, publish: false });
}

export async function publishPortfolio(input: { id?: string; slug: string; data: unknown }) {
  return upsertPortfolio({ ...input, publish: true });
}

/* ------------------------------- management ------------------------------- */

export async function setPublished(id: string, published: boolean) {
  const userId = await requireUser();
  const owned = await prisma.portfolio.findFirst({ where: { id, userId } });
  if (!owned) return { ok: false as const, error: "Not found." };
  await prisma.portfolio.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : owned.publishedAt },
  });
  revalidatePath(`/${owned.slug}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function deletePortfolio(id: string) {
  const userId = await requireUser();
  const owned = await prisma.portfolio.findFirst({ where: { id, userId } });
  if (!owned) return { ok: false as const, error: "Not found." };
  await prisma.portfolio.delete({ where: { id } });
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function duplicatePortfolio(id: string) {
  const userId = await requireUser();
  const src = await prisma.portfolio.findFirst({ where: { id, userId } });
  if (!src) return { ok: false as const, error: "Not found." };

  // Find an available slug like "<slug>-copy", "<slug>-copy-2", ...
  let base = `${src.slug}-copy`.slice(0, 30);
  let candidate = base;
  let n = 2;
  while (await prisma.portfolio.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${n++}`.slice(0, 30);
  }

  const copy = await prisma.portfolio.create({
    data: {
      userId,
      slug: candidate,
      title: `${src.title} (copy)`,
      templateId: src.templateId,
      content: src.content as object,
      published: false,
    },
  });
  revalidatePath("/dashboard");
  return { ok: true as const, id: copy.id };
}

export async function loadPortfolio(
  id: string
): Promise<{ data: PortfolioData; slug: string } | null> {
  const userId = await requireUser();
  const record = await prisma.portfolio.findFirst({ where: { id, userId } });
  if (!record) return null;
  const parsed = portfolioDataSchema.safeParse(record.content);
  return parsed.success ? { data: parsed.data, slug: record.slug } : null;
}
