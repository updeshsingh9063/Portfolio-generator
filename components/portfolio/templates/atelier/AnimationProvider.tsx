"use client";

import { AnimationContext, type AnimationIntensity } from "@/components/portfolio/shared/reveal";

export function AnimationProvider({
  intensity,
  children,
}: {
  intensity: AnimationIntensity;
  children: React.ReactNode;
}) {
  return <AnimationContext.Provider value={intensity}>{children}</AnimationContext.Provider>;
}
