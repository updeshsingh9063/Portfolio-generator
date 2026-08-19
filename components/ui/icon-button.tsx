"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-[background-color,color,border-color,transform] " +
    "duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        solid: "bg-ink text-on-dark hover:bg-ink-soft",
        outline: "border border-line-strong text-foreground hover:bg-surface hover:border-foreground/30",
        ghost: "text-foreground hover:bg-surface-2",
        accent: "bg-accent text-white hover:bg-accent-deep",
      },
      size: {
        sm: "size-8 [&_svg]:size-4",
        md: "size-10 [&_svg]:size-[1.15rem]",
        lg: "size-12 [&_svg]:size-5",
      },
      shape: { round: "rounded-[var(--radius-pill)]", square: "rounded-[var(--radius-sm)]" },
    },
    defaultVariants: { variant: "ghost", size: "md", shape: "round" },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, shape, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(iconButtonVariants({ variant, size, shape }), className)}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";
