"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium select-none " +
    "transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
    "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-on-dark hover:bg-ink-soft shadow-sm hover:shadow-md",
        accent:
          "bg-accent text-white hover:bg-accent-deep shadow-sm hover:shadow-md",
        outline:
          "border border-line-strong bg-transparent text-foreground hover:bg-surface hover:border-foreground/30",
        ghost: "bg-transparent text-foreground hover:bg-surface-2",
        subtle: "bg-surface-2 text-foreground hover:bg-line",
        link: "bg-transparent text-foreground underline-offset-4 hover:text-accent-deep hover:underline px-0",
        onDark:
          "bg-on-dark text-ink hover:bg-white shadow-sm",
      },
      size: {
        sm: "h-9 rounded-[var(--radius-sm)] px-3.5 text-[0.8rem]",
        md: "h-11 rounded-[var(--radius-md)] px-5 text-[0.875rem]",
        lg: "h-[3.25rem] rounded-[var(--radius-md)] px-7 text-[0.95rem]",
        pill: "h-11 rounded-[var(--radius-pill)] px-6 text-[0.875rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
