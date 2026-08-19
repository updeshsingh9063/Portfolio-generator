"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { useHydrated } from "@/lib/use-hydrated";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { Spinner } from "@/components/ui/loading-state";

/**
 * Standalone render of the current draft — embedded as an iframe in the editor
 * and the onboarding preview. Reads the same localStorage-persisted draft.
 */
export default function DraftPreviewPage() {
  const data = useOnboarding((s) => s.data);
  const hydrated = useHydrated();

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
            Start filling in your details and watch this update.
          </p>
        </div>
      </div>
    );
  }

  return <PortfolioRenderer data={data} />;
}
