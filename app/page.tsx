import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="grain flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="overline mb-6">Portfolio Generator · Design System</p>
      <h1 className="font-display text-display leading-[0.9] tracking-tight">Folio</h1>
      <p className="mt-6 max-w-md text-body text-muted">
        Enter your details, choose a design, and get a premium portfolio website you can share with
        recruiters and clients.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/create"
          className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-ink px-6 py-3 text-[0.875rem] font-medium text-on-dark transition-colors hover:bg-ink-soft"
        >
          Create my portfolio
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/preview"
          className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-line-strong px-6 py-3 text-[0.875rem] font-medium text-foreground transition-colors hover:bg-surface"
        >
          See an example
        </Link>
      </div>
      <Link
        href="/styleguide"
        className="mt-5 text-caption uppercase tracking-[0.18em] text-faint transition-colors hover:text-foreground"
      >
        Design system
      </Link>
    </main>
  );
}
