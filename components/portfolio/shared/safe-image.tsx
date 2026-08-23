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
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Reset when the source changes.
  React.useEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src]);

  // Server-rendered markup, cached images, and instant `data:` URLs often finish
  // loading before React attaches onLoad during hydration — so the load event
  // never fires. Reconcile from the element's own `complete` state on mount.
  React.useEffect(() => {
    if (!src) return;
    const img = imgRef.current;
    if (img?.complete) {
      setStatus(img.naturalWidth > 0 ? "loaded" : "error");
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      {src && status !== "error" && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          decoding="async"
          onLoad={(e) => setStatus(e.currentTarget.naturalWidth > 0 ? "loaded" : "error")}
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
