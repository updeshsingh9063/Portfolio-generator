import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shimmering skeleton block. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-sm)] bg-[linear-gradient(90deg,var(--color-surface-2)_25%,var(--color-line)_37%,var(--color-surface-2)_63%)] " +
          "bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

/** Centered spinner with optional label. */
export function Spinner({
  label,
  className,
  size = "md",
}: {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "size-4", md: "size-6", lg: "size-8" };
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-10 text-muted", className)}>
      <Loader2 className={cn("animate-spin text-accent-deep", sizes[size])} aria-hidden />
      {label && <span className="text-small">{label}</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** A representative card skeleton for portfolio/project loading. */
export function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-4">
      <Skeleton className="mb-4 aspect-[4/3] w-full rounded-[var(--radius-md)]" />
      <Skeleton className="mb-2 h-3.5 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
