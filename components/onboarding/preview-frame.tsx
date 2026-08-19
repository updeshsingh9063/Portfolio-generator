"use client";

import * as React from "react";
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";

type Device = "desktop" | "tablet" | "mobile";

const WIDTHS: Record<Device, number | null> = { desktop: null, tablet: 834, mobile: 390 };

/** Device-switchable iframe preview of the live draft. */
export function PreviewFrame({
  src,
  className,
  frameClassName,
}: {
  src: string;
  className?: string;
  frameClassName?: string;
}) {
  const [device, setDevice] = React.useState<Device>("desktop");
  const [nonce, setNonce] = React.useState(0);
  const width = WIDTHS[device];

  const devices: { id: Device; icon: React.ReactNode; label: string }[] = [
    { id: "desktop", icon: <Monitor className="size-4" />, label: "Desktop" },
    { id: "tablet", icon: <Tablet className="size-4" />, label: "Tablet" },
    { id: "mobile", icon: <Smartphone className="size-4" />, label: "Mobile" },
  ];

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-2", className)}>
      {/* toolbar */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-2">
        <div className="flex items-center gap-1 rounded-[var(--radius-pill)] border border-line bg-paper p-0.5">
          {devices.map((d) => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              aria-label={d.label}
              aria-pressed={device === d.id}
              className={cn(
                "grid size-8 place-items-center rounded-[var(--radius-pill)] transition-colors",
                device === d.id ? "bg-ink text-on-dark" : "text-muted hover:text-foreground"
              )}
            >
              {d.icon}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <IconButton aria-label="Refresh preview" variant="ghost" size="sm" onClick={() => setNonce((n) => n + 1)}>
            <RotateCw />
          </IconButton>
          <IconButton aria-label="Open in new tab" variant="ghost" size="sm" onClick={() => window.open(src, "_blank")}>
            <ExternalLink />
          </IconButton>
        </div>
      </div>

      {/* stage */}
      <div className="flex flex-1 justify-center overflow-auto bg-surface-2 p-4">
        <div
          className={cn(
            "h-full overflow-hidden bg-paper shadow-md transition-[width] duration-[var(--duration-normal)]",
            width ? "rounded-[var(--radius-lg)] border border-line" : "w-full rounded-[var(--radius-md)]",
            frameClassName
          )}
          style={width ? { width } : undefined}
        >
          <iframe
            key={nonce}
            src={src}
            title="Portfolio preview"
            className="size-full"
            style={{ minHeight: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
