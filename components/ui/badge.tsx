import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-sans font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        solid: "bg-ink text-on-dark",
        accent: "bg-accent/12 text-accent-deep",
        outline: "border border-line-strong text-foreground",
        muted: "bg-surface-2 text-muted",
        success: "bg-success/12 text-success",
        warning: "bg-warning/14 text-warning",
        error: "bg-error/12 text-error",
        onDark: "bg-white/10 text-on-dark border border-white/10",
      },
      size: {
        sm: "h-6 px-2.5 text-[0.68rem] rounded-[var(--radius-sm)]",
        md: "h-7 px-3 text-caption rounded-[var(--radius-sm)]",
      },
      pill: { true: "rounded-[var(--radius-pill)]", false: "" },
    },
    defaultVariants: { variant: "muted", size: "md", pill: false },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, pill, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, pill }), className)} {...props} />;
}
