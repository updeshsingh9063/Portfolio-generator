"use client";

import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { temporal } from "zundo";
import type {
  PortfolioData,
  Profile,
  PortfolioSettings,
} from "@/lib/portfolio/schema";
import { blankPortfolio } from "@/lib/portfolio/blank";

/* --------------------------------- steps ---------------------------------- */

export interface StepDef {
  id: string;
  label: string;
  optional?: boolean;
}

export const STEPS: StepDef[] = [
  { id: "personal", label: "Personal" },
  { id: "education", label: "Education", optional: true },
  { id: "experience", label: "Experience", optional: true },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications", optional: true },
  { id: "achievements", label: "Achievements", optional: true },
  { id: "socials", label: "Social Links" },
  { id: "resume", label: "Résumé", optional: true },
  { id: "design", label: "Design" },
  { id: "review", label: "Preview" },
];

/** Array sections whose entries carry an `id`. */
export type EntrySection =
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "achievements"
  | "socials";

type Entry = { id: string } & Record<string, unknown>;

/* --------------------------------- store ---------------------------------- */

interface OnboardingState {
  data: PortfolioData;
  step: number;
  lastSavedAt: number | null;
  /** DB id once the portfolio has been saved/published (null while local-only). */
  dbId: string | null;
  /** The published slug, if any. */
  slug: string | null;

  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  setDbInfo: (info: { dbId: string; slug: string }) => void;

  patchProfile: (patch: Partial<Profile>) => void;
  patchSettings: (patch: Partial<PortfolioSettings>) => void;

  addEntry: (section: EntrySection, entry: Entry) => void;
  updateEntry: (section: EntrySection, id: string, patch: Record<string, unknown>) => void;
  removeEntry: (section: EntrySection, id: string) => void;

  loadData: (data: PortfolioData) => void;
  reset: () => void;
}

function stamp(): number {
  return typeof Date !== "undefined" ? Date.now() : 0;
}

export const useOnboarding = create<OnboardingState>()(
  temporal(
    persist(
      (set) => ({
      data: blankPortfolio(),
      step: 0,
      lastSavedAt: null,
      dbId: null,
      slug: null,

      setStep: (step) => set({ step: Math.max(0, Math.min(STEPS.length - 1, step)) }),
      next: () => set((s) => ({ step: Math.min(STEPS.length - 1, s.step + 1) })),
      back: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
      setDbInfo: ({ dbId, slug }) => set({ dbId, slug }),

      patchProfile: (patch) =>
        set((s) => ({
          data: { ...s.data, profile: { ...s.data.profile, ...patch } },
          lastSavedAt: stamp(),
        })),

      patchSettings: (patch) =>
        set((s) => ({
          data: { ...s.data, settings: { ...s.data.settings, ...patch } },
          lastSavedAt: stamp(),
        })),

      addEntry: (section, entry) =>
        set((s) => ({
          data: {
            ...s.data,
            [section]: [...(s.data[section] as Entry[]), entry],
          } as PortfolioData,
          lastSavedAt: stamp(),
        })),

      updateEntry: (section, id, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            [section]: (s.data[section] as Entry[]).map((e) =>
              e.id === id ? { ...e, ...patch } : e
            ),
          } as PortfolioData,
          lastSavedAt: stamp(),
        })),

      removeEntry: (section, id) =>
        set((s) => ({
          data: {
            ...s.data,
            [section]: (s.data[section] as Entry[]).filter((e) => e.id !== id),
          } as PortfolioData,
          lastSavedAt: stamp(),
        })),

      loadData: (data) => set({ data, lastSavedAt: stamp() }),
      reset: () => set({ data: blankPortfolio(), step: 0, lastSavedAt: stamp(), dbId: null, slug: null }),
    }),
    {
      name: "folio-onboarding-draft",
      partialize: (s) => ({ data: s.data, step: s.step, lastSavedAt: s.lastSavedAt, dbId: s.dbId, slug: s.slug }),
      }
    ),
    {
      limit: 50,
      partialize: (state) => ({ data: state.data }),
    }
  )
);

/** Undo/redo bound to the `data` history (zundo temporal store). */
export function useTimeTravel() {
  const undo = () => useOnboarding.temporal.getState().undo();
  const redo = () => useOnboarding.temporal.getState().redo();
  const clear = () => useOnboarding.temporal.getState().clear();
  const canUndo = useStore(useOnboarding.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useStore(useOnboarding.temporal, (s) => s.futureStates.length > 0);
  return { undo, redo, clear, canUndo, canRedo };
}

/** Whether a step has enough data to be considered "complete" for the rail. */
export function stepComplete(data: PortfolioData, stepId: string): boolean {
  switch (stepId) {
    case "personal":
      return Boolean(data.profile.fullName && data.profile.headline && data.profile.email);
    case "education":
      return data.education.length > 0;
    case "experience":
      return data.experience.length > 0;
    case "projects":
      return data.projects.length > 0;
    case "skills":
      return data.skills.length > 0;
    case "certifications":
      return data.certifications.length > 0;
    case "achievements":
      return data.achievements.length > 0;
    case "socials":
      return data.socials.length > 0;
    case "resume":
      return Boolean(data.profile.resumeUrl);
    default:
      return false;
  }
}
