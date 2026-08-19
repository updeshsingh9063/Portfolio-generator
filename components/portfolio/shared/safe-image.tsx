"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Image that degrades gracefully: shows a toned placeholder while loading and
 * if the source fails. Uses a plain <img> for reliability with external hosts;
 * performance optimization (next/image) is applied in the polish phase.
 */
export function SafeImage({
  src,
  alt,
  className,
  imgClassName,
  fallbackLabel,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
}) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  );

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      {src && status !== "error" && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "size-full object-cover transition-opacity duration-700",
            status === "loaded" ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}
      {status !== "loaded" && (
        <div className="absolute inset-0 grid place-items-center bg-surface-2 text-faint">
          {status === "error" && fallbackLabel && (
            <span className="font-display text-2xl opacity-40">{fallbackLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
