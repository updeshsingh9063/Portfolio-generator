import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/portfolio/shared/reveal";

type Tone = "paper" | "surface" | "ink";

const toneClasses: Record<Tone, string> = {
  paper: "bg-paper text-foreground",
  surface: "bg-surface text-foreground",
  ink: "bg-ink text-on-dark",
};

/** A portfolio section: consistent vertical rhythm, anchor id, and tone. */
export function AtelierSection({
  id,
  tone = "paper",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-24 lg:py-32", toneClasses[tone], className)}>
      <div className={cn("mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-10", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/** The reference's labelled header: gold overline ——— optional link. */
export function SectionHeader({
  label,
  link,
  onDark = false,
  className,
}: {
  label: string;
  link?: { text: string; href: string };
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal>
      <div className={cn("mb-12 flex items-center gap-6 sm:mb-16", className)}>
        <span
          className={cn(
            "shrink-0 text-caption font-medium uppercase tracking-[0.22em]",
            onDark ? "text-accent-bright" : "text-accent-deep"
          )}
        >
          {label}
        </span>
        <span className={cn("h-px flex-1", onDark ? "bg-white/15" : "bg-line-strong")} />
        {link && (
          <a
            href={link.href}
            className={cn(
              "group inline-flex shrink-0 items-center gap-2 text-caption font-medium uppercase tracking-[0.18em] transition-colors",
              onDark ? "text-on-dark-muted hover:text-on-dark" : "text-muted hover:text-foreground"
            )}
          >
            {link.text}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        )}
      </div>
    </Reveal>
  );
}
