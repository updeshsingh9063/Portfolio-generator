"use client";

import * as React from "react";
import { Check, Loader2, X, Rocket, ExternalLink, PartyPopper } from "lucide-react";
import { useOnboarding } from "@/lib/store/onboarding";
import { checkUsername, publishPortfolio } from "@/app/actions/portfolio";
import { validateUsername, slugify, USERNAME_ERROR_MESSAGES } from "@/lib/portfolio/username";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ShareCard } from "@/components/share/share-card";
import { cn } from "@/lib/utils";

type Availability =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ok" }
  | { status: "bad"; error: string; suggestions?: string[] };

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

export function PublishDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const data = useOnboarding((s) => s.data);
  const dbId = useOnboarding((s) => s.dbId);
  const storedSlug = useOnboarding((s) => s.slug);
  const setDbInfo = useOnboarding((s) => s.setDbInfo);

  const [slug, setSlug] = React.useState("");
  const [avail, setAvail] = React.useState<Availability>({ status: "idle" });
  const [publishing, setPublishing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Seed the slug when opened.
  React.useEffect(() => {
    if (open && !slug) {
      setSlug(storedSlug || slugify(data.profile.fullName) || "");
    }
  }, [open, storedSlug, data.profile.fullName, slug]);

  // Debounced availability check.
  React.useEffect(() => {
    if (!slug) return setAvail({ status: "idle" });
    const local = validateUsername(slug);
    if (!local.ok) return setAvail({ status: "bad", error: USERNAME_ERROR_MESSAGES[local.error] });

    setAvail({ status: "checking" });
    const t = setTimeout(async () => {
      const res = await checkUsername(slug, dbId ?? undefined);
      if (res.available) setAvail({ status: "ok" });
      else setAvail({ status: "bad", error: res.error ?? "Unavailable", suggestions: res.suggestions });
    }, 400);
    return () => clearTimeout(t);
  }, [slug, dbId]);

  const publish = async () => {
    setError(null);
    setPublishing(true);
    const res = await publishPortfolio({ id: dbId ?? undefined, slug, data });
    setPublishing(false);
    if (!res.ok) {
      if (/sign in/i.test(res.error)) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent("/editor")}`;
        return;
      }
      setError(res.error);
      return;
    }
    setDbInfo({ dbId: res.id, slug: res.slug });
    setSuccess(`${window.location.origin}/${res.slug}`);
  };

  const title = data.profile.fullName
    ? `${data.profile.fullName} — ${data.profile.headline}`
    : "My portfolio";

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        {success ? (
          <div>
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2">
                <PartyPopper className="size-5 text-accent-deep" /> You&apos;re live!
              </ModalTitle>
              <ModalDescription>
                Your portfolio is published and indexable. Share it with the world.
              </ModalDescription>
            </ModalHeader>
            <ShareCard url={success} title={title} />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Done
              </Button>
              <Button variant="accent" asChild>
                <a href={success} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" /> View live
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2">
                <Rocket className="size-5 text-accent-deep" /> Publish your portfolio
              </ModalTitle>
              <ModalDescription>Choose your public address. You can change it later.</ModalDescription>
            </ModalHeader>

            <label className="mb-1.5 block text-[0.8rem] font-medium text-foreground">Your URL</label>
            <div
              className={cn(
                "flex items-center rounded-[var(--radius-md)] border bg-surface pr-3 transition-colors focus-within:ring-4",
                avail.status === "ok"
                  ? "border-success focus-within:ring-success/12"
                  : avail.status === "bad"
                  ? "border-error focus-within:ring-error/12"
                  : "border-line focus-within:border-accent focus-within:ring-accent/12"
              )}
            >
              <span className="whitespace-nowrap py-2.5 pl-3.5 text-[0.85rem] text-faint">{ROOT}/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="your-name"
                className="h-11 flex-1 bg-transparent text-[0.9rem] text-foreground placeholder:text-faint focus:outline-none"
                autoFocus
              />
              <span className="grid size-5 place-items-center">
                {avail.status === "checking" && <Loader2 className="size-4 animate-spin text-faint" />}
                {avail.status === "ok" && <Check className="size-4 text-success" />}
                {avail.status === "bad" && <X className="size-4 text-error" />}
              </span>
            </div>

            {avail.status === "ok" && <p className="mt-1.5 text-caption text-success">✓ Available</p>}
            {avail.status === "bad" && (
              <div className="mt-1.5">
                <p className="text-caption text-error">{avail.error}</p>
                {avail.suggestions && avail.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {avail.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSlug(s)}
                        className="rounded-[var(--radius-pill)] border border-line-strong px-2.5 py-1 text-caption text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && <p className="mt-3 text-caption text-error">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                loading={publishing}
                disabled={avail.status !== "ok"}
                onClick={publish}
              >
                <Rocket className="size-4" /> Publish now
              </Button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
