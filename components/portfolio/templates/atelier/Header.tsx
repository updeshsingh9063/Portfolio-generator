"use client";

import * as React from "react";
import { Plus, X, Menu, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioData, SectionKey } from "@/lib/portfolio/schema";
import { SECTION_LABELS, initials } from "@/lib/portfolio/helpers";
import { socialLabel, socialHref } from "@/components/portfolio/shared/social-icon";

export function Header({
  data,
  sections,
  year,
}: {
  data: PortfolioData;
  sections: SectionKey[];
  year: number;
}) {
  const [open, setOpen] = React.useState(false);
  const { profile } = data;
  const navSections = sections.filter((s) => s !== "contact");

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-accent/15 text-accent-deep transition-colors hover:bg-accent/25"
            >
              <Menu className="size-[1.1rem]" />
            </button>
            <span className="text-caption font-medium uppercase tracking-[0.22em] text-foreground">
              {profile.roleLabel || profile.headline}
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-caption font-medium uppercase tracking-[0.22em] text-muted">
            <Plus className="size-3.5 text-accent" />
            {year}
          </span>
        </div>
      </header>

      {/* Editorial full-screen menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-[var(--duration-normal)]",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-ink-warm/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper px-8 py-6 shadow-float transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] sm:px-10",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="mb-12 flex items-center justify-between">
            <span className="font-display text-xl font-medium">{initials(profile.fullName)}</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-[var(--radius-md)] text-foreground transition-colors hover:bg-surface-2"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-col">
            {navSections.map((s, i) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-line py-4 transition-colors hover:text-accent-deep"
              >
                <span className="w-8 text-caption tabular-nums text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-3xl font-medium">{SECTION_LABELS[s]}</span>
                <ArrowUpRight className="ml-auto size-5 -translate-y-1 text-faint opacity-0 transition-all group-hover:opacity-100" />
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <p className="overline mb-3">Connect</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {data.socials.map((s) => (
                <a
                  key={s.id}
                  href={socialHref(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small text-muted transition-colors hover:text-foreground"
                >
                  {socialLabel(s)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
