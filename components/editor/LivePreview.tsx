"use client";

import * as React from "react";
import { Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/lib/store/onboarding";
import { IconButton } from "@/components/ui/icon-button";

type Device = "desktop" | "tablet" | "mobile";
const WIDTHS: Record<Device, number | null> = { desktop: null, tablet: 834, mobile: 390 };

/** Real-time portfolio preview: pushes every store change into the iframe. */
export function LivePreview({ className }: { className?: string }) {
  const data = useOnboarding((s) => s.data);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const readyRef = React.useRef(false);
  const [device, setDevice] = React.useState<Device>("desktop");
  const width = WIDTHS[device];

  const post = React.useCallback((payload: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "folio:data", data: payload },
      window.location.origin
    );
  }, []);

  // Push on every data change (structural clone via the store's fresh objects).
  React.useEffect(() => {
    if (readyRef.current) post(data);
  }, [data, post]);

  // When the iframe signals ready, send the current draft.
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "folio:ready") {
        readyRef.current = true;
        post(useOnboarding.getState().data);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post]);

  const devices: { id: Device; icon: React.ReactNode; label: string }[] = [
    { id: "desktop", icon: <Monitor className="size-4" />, label: "Desktop" },
    { id: "tablet", icon: <Tablet className="size-4" />, label: "Tablet" },
    { id: "mobile", icon: <Smartphone className="size-4" />, label: "Mobile" },
  ];

  return (
    <div className={cn("flex flex-col overflow-hidden bg-surface-2", className)}>
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
        <div className="flex items-center gap-2">
          <span className="hidden text-caption text-faint sm:inline">Live preview</span>
          <IconButton
            aria-label="Open preview in new tab"
            variant="ghost"
            size="sm"
            onClick={() => window.open("/editor/preview", "_blank")}
          >
            <ExternalLink />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-1 justify-center overflow-auto p-4">
        <div
          className={cn(
            "h-full overflow-hidden bg-paper shadow-md transition-[width] duration-[var(--duration-normal)]",
            width ? "rounded-[var(--radius-lg)] border border-line" : "w-full rounded-[var(--radius-md)]"
          )}
          style={width ? { width } : undefined}
        >
          <iframe ref={iframeRef} src="/editor/preview" title="Live portfolio preview" className="size-full" />
        </div>
      </div>
    </div>
  );
}
