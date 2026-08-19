"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Plus, MoreHorizontal, Pencil, ExternalLink, Eye, EyeOff, Copy, Share2,
  CopyPlus, Trash2, LogOut, Monitor, Tablet, Smartphone, BarChart3, Rocket,
} from "lucide-react";
import { useOnboarding } from "@/lib/store/onboarding";
import { setPublished, deletePortfolio, duplicatePortfolio } from "@/app/actions/portfolio";
import { Wordmark } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { ShareCard } from "@/components/share/share-card";
import {
  Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger,
} from "@/components/ui/dropdown";
import {
  Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle,
} from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { initials } from "@/lib/portfolio/helpers";

export interface PortfolioSummary {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  views: number;
  updatedAt: string;
  templateName: string;
  name: string;
  headline: string;
  avatar?: string;
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : `${Math.floor(d / 30)}mo ago`;
}

function Stat({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
      <div className="flex items-center gap-2 text-caption uppercase tracking-[0.14em] text-faint">
        {icon} {label}
      </div>
      <p className="mt-2 font-display text-h2 leading-none text-foreground">{value}</p>
    </div>
  );
}

export function DashboardClient({
  userName,
  portfolios,
  stats,
  devices,
}: {
  userName: string;
  portfolios: PortfolioSummary[];
  stats: { total: number; published: number; totalViews: number };
  devices: { desktop: number; tablet: number; mobile: number };
}) {
  const router = useRouter();
  const resetDraft = useOnboarding((s) => s.reset);
  const [shareFor, setShareFor] = React.useState<PortfolioSummary | null>(null);
  const [deleteFor, setDeleteFor] = React.useState<PortfolioSummary | null>(null);
  const [busy, setBusy] = React.useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const urlFor = (slug: string) => `${origin}/${slug}`;
  const deviceTotal = devices.desktop + devices.tablet + devices.mobile || 1;

  const newPortfolio = () => {
    resetDraft();
    router.push("/create");
  };

  const togglePublish = async (p: PortfolioSummary) => {
    setBusy(true);
    const res = await setPublished(p.id, !p.published);
    setBusy(false);
    if (res.ok) {
      toast.success(p.published ? "Unpublished" : "Published");
      router.refresh();
    } else toast.error(res.error);
  };

  const duplicate = async (p: PortfolioSummary) => {
    setBusy(true);
    const res = await duplicatePortfolio(p.id);
    setBusy(false);
    if (res.ok) {
      toast.success("Duplicated");
      router.refresh();
    } else toast.error(res.error);
  };

  const confirmDelete = async () => {
    if (!deleteFor) return;
    setBusy(true);
    const res = await deletePortfolio(deleteFor.id);
    setBusy(false);
    setDeleteFor(null);
    if (res.ok) {
      toast.success("Deleted");
      router.refresh();
    } else toast.error(res.error);
  };

  const copyUrl = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(urlFor(slug));
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <Wordmark />
            <span className="hidden text-caption uppercase tracking-[0.2em] text-faint sm:inline">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="accent" size="sm" onClick={newPortfolio}>
              <Plus className="size-4" /> New portfolio
            </Button>
            <Dropdown>
              <DropdownTrigger asChild>
                <button className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  <Avatar size="sm" fallback={initials(userName)} />
                </button>
              </DropdownTrigger>
              <DropdownContent align="end">
                <div className="px-2.5 py-2 text-caption text-faint">Signed in as</div>
                <div className="truncate px-2.5 pb-2 text-[0.85rem] font-medium text-foreground">
                  {userName}
                </div>
                <DropdownSeparator />
                <DropdownItem destructive onSelect={() => signOut({ callbackUrl: "/" })}>
                  <LogOut /> Sign out
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-10 sm:px-8">
        <div className="mb-8">
          <p className="overline mb-2">Welcome back</p>
          <h1 className="font-display text-h1 leading-none text-foreground">Hi, {userName.split(" ")[0]}</h1>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Portfolios" value={stats.total} />
          <Stat label="Published" value={stats.published} />
          <Stat label="Total views" value={stats.totalViews} icon={<BarChart3 className="size-3.5" />} />
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <div className="mb-3 text-caption uppercase tracking-[0.14em] text-faint">Views by device</div>
            <div className="flex flex-col gap-2">
              {[
                { icon: <Monitor className="size-3.5" />, v: devices.desktop, label: "Desktop" },
                { icon: <Tablet className="size-3.5" />, v: devices.tablet, label: "Tablet" },
                { icon: <Smartphone className="size-3.5" />, v: devices.mobile, label: "Mobile" },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="text-faint">{d.icon}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${(d.v / deviceTotal) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-caption tabular-nums text-faint">{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolios */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-h3 text-foreground">Your portfolios</h2>
        </div>

        {portfolios.length === 0 ? (
          <EmptyState
            icon={<Rocket />}
            title="No portfolios yet"
            description="Create your first portfolio — it takes just a few minutes."
            action={
              <Button variant="accent" onClick={newPortfolio}>
                <Plus className="size-4" /> Create a portfolio
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((p) => (
              <div key={p.id} className="flex flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar size="md" src={p.avatar} fallback={initials(p.name)} />
                    <div className="min-w-0">
                      <p className="truncate font-display text-h4 leading-tight text-foreground">{p.name}</p>
                      <p className="truncate text-caption text-muted">{p.headline}</p>
                    </div>
                  </div>
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <button aria-label="Actions" className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-faint transition-colors hover:bg-surface-2 hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownTrigger>
                    <DropdownContent align="end">
                      <DropdownItem onSelect={() => router.push(`/editor?id=${p.id}`)}>
                        <Pencil /> Edit
                      </DropdownItem>
                      <DropdownItem onSelect={() => window.open(urlFor(p.slug), "_blank")}>
                        <ExternalLink /> View live
                      </DropdownItem>
                      <DropdownItem onSelect={() => togglePublish(p)}>
                        {p.published ? <EyeOff /> : <Eye />} {p.published ? "Unpublish" : "Publish"}
                      </DropdownItem>
                      <DropdownItem onSelect={() => copyUrl(p.slug)}>
                        <Copy /> Copy URL
                      </DropdownItem>
                      <DropdownItem onSelect={() => setShareFor(p)}>
                        <Share2 /> Share
                      </DropdownItem>
                      <DropdownItem onSelect={() => duplicate(p)}>
                        <CopyPlus /> Duplicate
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem destructive onSelect={() => setDeleteFor(p)}>
                        <Trash2 /> Delete
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  {p.published ? (
                    <Badge variant="success" size="sm">Published</Badge>
                  ) : (
                    <Badge variant="muted" size="sm">Draft</Badge>
                  )}
                  <Badge variant="outline" size="sm">{p.templateName}</Badge>
                </div>

                <button
                  onClick={() => copyUrl(p.slug)}
                  className="mb-4 truncate rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2 text-left text-caption text-muted transition-colors hover:text-foreground"
                  title="Copy URL"
                >
                  /{p.slug}
                </button>

                <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-caption text-faint">
                  <span className="flex items-center gap-1.5">
                    <Eye className="size-3.5" /> {p.views} views
                  </span>
                  <span>Updated {relTime(p.updatedAt)}</span>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/editor?id=${p.id}`)}>
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  {p.published && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(urlFor(p.slug), "_blank")}>
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Share modal */}
      <Modal open={!!shareFor} onOpenChange={(v) => !v && setShareFor(null)}>
        <ModalContent size="md">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <Share2 className="size-5 text-accent-deep" /> Share portfolio
            </ModalTitle>
            <ModalDescription>{shareFor?.title}</ModalDescription>
          </ModalHeader>
          {shareFor && <ShareCard url={urlFor(shareFor.slug)} title={shareFor.title} />}
        </ModalContent>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteFor} onOpenChange={(v) => !v && setDeleteFor(null)}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Delete portfolio?</ModalTitle>
            <ModalDescription>
              This permanently deletes “{deleteFor?.name}” and its analytics. This can&apos;t be undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteFor(null)}>Cancel</Button>
            <Button variant="accent" loading={busy} onClick={confirmDelete} className="!bg-error hover:!bg-error/85">
              <Trash2 className="size-4" /> Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
