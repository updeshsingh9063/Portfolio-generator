"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "!bg-[var(--color-surface)] !border !border-[var(--color-line)] !rounded-[var(--radius-md)] " +
            "!shadow-lg !text-[var(--color-foreground)] !font-sans",
          title: "!text-[0.875rem] !font-medium",
          description: "!text-[var(--color-muted)] !text-[0.8rem]",
          actionButton: "!bg-[var(--color-ink)] !text-[var(--color-on-dark)] !rounded-[var(--radius-sm)]",
          cancelButton: "!bg-[var(--color-surface-2)] !text-[var(--color-foreground)] !rounded-[var(--radius-sm)]",
          success: "[&_[data-icon]]:!text-[var(--color-success)]",
          error: "[&_[data-icon]]:!text-[var(--color-error)]",
          warning: "[&_[data-icon]]:!text-[var(--color-warning)]",
        },
      }}
    />
  );
}

export { toast };
