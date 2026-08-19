"use client";

import * as React from "react";

/** True only after the first client render — guards localStorage-backed state. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}
