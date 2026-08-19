import * as React from "react";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  showLabel = false,
  tone = "ink",
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  tone?: "ink" | "accent";
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]",
            tone === "ink" ? "bg-ink" : "bg-accent"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-caption tabular-nums text-muted">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

/** Vertical skill meter variant, thin and elegant. */
export function SkillMeter({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.85rem] font-medium">{label}</span>
        <span className="text-caption tabular-nums text-faint">{pct}%</span>
      </div>
      <ProgressBar value={pct} tone="accent" />
    </div>
  );
}
