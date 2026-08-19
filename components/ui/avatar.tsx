"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden bg-surface-2 select-none",
  {
    variants: {
      size: {
        sm: "size-9 text-[0.7rem]",
        md: "size-12 text-[0.85rem]",
        lg: "size-16 text-base",
        xl: "size-24 text-lg",
      },
      shape: { circle: "rounded-full", rounded: "rounded-[var(--radius-md)]" },
    },
    defaultVariants: { size: "md", shape: "circle" },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, shape, src, alt, fallback, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, shape }), className)}
    {...props}
  >
    {src && (
      <AvatarPrimitive.Image
        src={src}
        alt={alt ?? ""}
        className="aspect-square size-full object-cover"
      />
    )}
    <AvatarPrimitive.Fallback
      delayMs={src ? 300 : 0}
      className="flex size-full items-center justify-center font-sans font-medium uppercase tracking-wide text-muted"
    >
      {fallback}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));
Avatar.displayName = "Avatar";
