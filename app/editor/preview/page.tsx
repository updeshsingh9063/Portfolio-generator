"use client";

import * as React from "react";
import { useOnboarding } from "@/lib/store/onboarding";
import { useHydrated } from "@/lib/use-hydrated";
import type { PortfolioData } from "@/lib/portfolio/schema";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { Spinner } from "@/components/ui/loading-state";

/**
 * Real-time preview target. Renders whatever the editor posts via
 * `postMessage`, falling back to the persisted draft when opened directly.
 */
export default function EditorPreviewPage() {
  const storeData = useOnboarding((s) => s.data);
  const hydrated = useHydrated();
  const [live, setLive] = React.useState<PortfolioData | null>(null);

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "folio:data" && e.data.data) {
        setLive(e.data.data as PortfolioData);
      }
    };
    window.addEventListener("message", onMessage);
    // Tell the editor we're ready to receive the current draft.
    window.parent?.postMessage({ type: "folio:ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const data = live ?? storeData;

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <Spinner label="Loading preview…" />
      </div>
    );
  }

  if (!data.profile.fullName && data.projects.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-6 text-center">
        <div className="max-w-sm">
          <p className="overline mb-3">Live preview</p>
          <h2 className="font-display text-h3 text-foreground">Your portfolio appears here</h2>
          <p className="mt-2 text-small text-muted">
            Edit on the left and watch it update instantly.
          </p>
        </div>
      </div>
    );
  }

  return <PortfolioRenderer data={data} />;
}
