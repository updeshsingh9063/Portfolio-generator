import * as React from "react";

/** When true (inside the editor), steps skip their onboarding intro header. */
export const EmbeddedContext = React.createContext(false);

export function StepIntro({
  index,
  title,
  subtitle,
  optional,
}: {
  index: number;
  title: string;
  subtitle?: string;
  optional?: boolean;
}) {
  const embedded = React.useContext(EmbeddedContext);
  if (embedded) return null;
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center gap-3">
        <span className="text-caption font-medium uppercase tracking-[0.2em] text-accent-deep">
          Step {String(index + 1).padStart(2, "0")}
        </span>
        {optional && (
          <span className="rounded-[var(--radius-pill)] bg-surface-2 px-2.5 py-0.5 text-caption text-faint">
            Optional
          </span>
        )}
      </div>
      <h1 className="font-display text-h2 leading-tight text-foreground">{title}</h1>
      {subtitle && <p className="mt-2 max-w-xl text-body text-muted">{subtitle}</p>}
    </div>
  );
}

/** Two-column responsive grid for form fields. */
export function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>;
}

export function SectionList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}
