import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line-strong " +
          "bg-surface/50 px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 grid size-12 place-items-center rounded-full bg-surface-2 text-faint [&_svg]:size-5">
          {icon}
        </div>
      )}
      <h3 className="font-display text-h4 text-foreground">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-small text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
