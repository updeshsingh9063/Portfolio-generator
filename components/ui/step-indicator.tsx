"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  label: string;
}

/**
 * The onboarding step rail (01 Personal, 02 Education, ...). Editorial numerals.
 * `orientation="vertical"` for the sidebar rail, `horizontal` for compact bars.
 */
export function StepIndicator({
  steps,
  current,
  onStepClick,
  orientation = "vertical",
  className,
}: {
  steps: Step[];
  current: number;
  onStepClick?: (index: number) => void;
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  if (orientation === "horizontal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {steps.map((step, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <div
              key={step.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-[var(--duration-normal)]",
                state === "todo" ? "bg-surface-2" : state === "active" ? "bg-accent" : "bg-ink"
              )}
              aria-current={state === "active" ? "step" : undefined}
            />
          );
        })}
      </div>
    );
  }

  return (
    <ol className={cn("flex flex-col", className)}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        const clickable = !!onStepClick && i <= current;
        return (
          <li key={step.id} className="relative flex items-start gap-3.5 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-px",
                  i < current ? "bg-ink/25" : "bg-line-strong"
                )}
              />
            )}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(i)}
              className={cn(
                "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border text-[0.7rem] font-medium transition-colors",
                state === "done" && "border-ink bg-ink text-on-dark",
                state === "active" && "border-accent bg-accent/12 text-accent-deep",
                state === "todo" && "border-line-strong bg-surface text-faint",
                clickable && "cursor-pointer",
                !clickable && "cursor-default"
              )}
              aria-current={state === "active" ? "step" : undefined}
            >
              {state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
            </button>
            <div className="flex flex-col pt-0.5">
              <span className="text-caption uppercase tracking-wider text-faint">
                Step {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-[0.9rem] font-medium leading-tight",
                  state === "active" ? "text-foreground" : state === "done" ? "text-muted" : "text-faint"
                )}
              >
                {step.label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
