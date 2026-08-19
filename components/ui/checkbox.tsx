"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-[1.15rem] shrink-0 rounded-[6px] border border-line-strong bg-surface " +
        "transition-colors duration-[var(--duration-fast)] " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        "data-[state=checked]:bg-ink data-[state=checked]:border-ink data-[state=checked]:text-on-dark",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="size-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";
