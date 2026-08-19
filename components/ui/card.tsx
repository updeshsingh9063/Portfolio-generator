import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-[var(--radius-lg)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]", {
  variants: {
    variant: {
      surface: "bg-surface border border-line",
      outline: "bg-transparent border border-line",
      ink: "bg-ink-soft border border-line-dark text-on-dark",
      ghost: "bg-transparent",
    },
    interactive: {
      true: "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
      false: "",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: { variant: "surface", interactive: false, padding: "md" },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, padding }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-h4 leading-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-small text-muted", className)} {...props} />;
}
