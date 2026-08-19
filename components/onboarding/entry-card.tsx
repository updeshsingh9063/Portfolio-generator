"use client";

import * as React from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** A card wrapping one repeatable entry (education row, project, etc.). */
export function EntryCard({
  index,
  title,
  onRemove,
  children,
  className,
}: {
  index: number;
  title?: string;
  onRemove?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6", className)}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GripVertical className="size-4 text-faint/60" aria-hidden />
          <span className="text-caption font-medium uppercase tracking-[0.16em] text-faint">
            {title ?? `Entry ${String(index + 1).padStart(2, "0")}`}
          </span>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-caption font-medium text-faint transition-colors hover:bg-error/8 hover:text-error"
          >
            <Trash2 className="size-3.5" /> Remove
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function AddEntryButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" onClick={onClick} className="w-full border-dashed">
      <Plus className="size-4" /> {label}
    </Button>
  );
}
