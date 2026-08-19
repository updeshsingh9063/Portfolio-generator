"use client";

import * as React from "react";

/** Fires a single privacy-friendly view event per page load (no cookies). */
export function ViewTracker({ portfolioId }: { portfolioId: string }) {
  React.useEffect(() => {
    const key = `folio-viewed-${portfolioId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const device =
      window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portfolioId,
        device,
        referrer: document.referrer || null,
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [portfolioId]);

  return null;
}
