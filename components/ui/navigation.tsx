"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { IconButton } from "./icon-button";

export interface NavLink {
  label: string;
  href: string;
}

/** Product wordmark — editorial serif with a bronze dot. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-baseline gap-0.5", className)}>
      <span className="font-display text-[1.35rem] font-medium tracking-tight text-foreground">
        Folio
      </span>
      <span className="size-1.5 rounded-full bg-accent transition-transform duration-[var(--duration-normal)] group-hover:scale-125" />
    </Link>
  );
}

export function Navigation({
  links = [],
  actions,
  sticky = true,
}: {
  links?: NavLink[];
  actions?: React.ReactNode;
  sticky?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "top-0 z-40 w-full transition-colors duration-[var(--duration-normal)]",
        sticky && "sticky",
        scrolled
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.85rem] font-medium text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">{actions}</div>

        <div className="md:hidden">
          <IconButton
            aria-label={open ? "Close menu" : "Open menu"}
            variant="ghost"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </IconButton>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-2 py-2.5 text-[0.95rem] font-medium text-foreground hover:bg-surface-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">{actions}</div>
          </div>
        </div>
      )}
    </header>
  );
}

export { Button as NavButton };
