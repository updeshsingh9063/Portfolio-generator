"use client";

import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { temporal } from "zundo";
import type {
  PortfolioData,
  Profile,
  PortfolioSettings,
  Social,
} from "@/lib/portfolio/schema";
import { blankPortfolio } from "@/lib/portfolio/blank";
import type { ExtractedResume, ImportSection } from "@/lib/portfolio/resume-extract";

/* --------------------------------- steps ---------------------------------- */

export interface StepDef {
  id: string;
  label: string;
  optional?: boolean;
}

export const STEPS: StepDef[] = [
  { id: "import", label: "Import", optional: true },
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
  /** Merge résumé-extracted data into the draft for the chosen sections. */
  importData: (extracted: ExtractedResume, sections: ImportSection[]) => void;
  reset: () => void;
}

function stamp(): number {
  return typeof Date !== "undefined" ? Date.now() : 0;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${stamp()}-${Math.round(performance.now())}`;
}

const SOCIAL_PLATFORMS = new Set<Social["platform"]>([
  "linkedin", "github", "twitter", "instagram", "youtube", "behance", "dribbble",
  "medium", "kaggle", "leetcode", "stackoverflow", "website", "email", "custom",
]);

const isHttp = (u?: string) => Boolean(u && /^https?:\/\//i.test(u.trim()));

/** Fill an empty field only — never overwrite what the user already entered. */
const fill = (current: string | undefined, incoming?: string) =>
  current && current.trim() ? current : incoming?.trim() || current;

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

      importData: (extracted, sections) =>
        set((s) => {
          const sel = new Set(sections);
          const d = s.data;
          const next: PortfolioData = { ...d };

          if (sel.has("profile") && extracted.profile) {
            const p = extracted.profile;
            const cur = d.profile;
            next.profile = {
              ...cur,
              fullName: fill(cur.fullName, p.fullName) ?? "",
              headline: fill(cur.headline, p.headline) ?? "",
              email: fill(cur.email, p.email),
              phone: fill(cur.phone, p.phone),
              location: fill(cur.location, p.location),
              website: fill(cur.website, p.website),
              bio: fill(cur.bio, p.bio),
              about: fill(cur.about, p.about),
            };
          }

          if (sel.has("experience")) {
            next.experience = [
              ...d.experience,
              ...extracted.experience
                .filter((e) => (e.company ?? "").trim() || (e.title ?? "").trim())
                .map((e) => ({
                  id: uid(),
                  company: e.company ?? "",
                  title: e.title ?? "",
                  employmentType: e.employmentType,
                  location: e.location,
                  startDate: e.startDate,
                  endDate: e.endDate,
                  current: e.current ?? false,
                  description: undefined,
                  responsibilities: e.responsibilities ?? [],
                  achievements: [],
                  technologies: e.technologies ?? [],
                })),
            ];
          }

          if (sel.has("education")) {
            next.education = [
              ...d.education,
              ...extracted.education
                .filter((e) => (e.institution ?? "").trim())
                .map((e) => ({
                  id: uid(),
                  institution: e.institution ?? "",
                  degree: e.degree,
                  field: e.field,
                  startYear: e.startYear,
                  endYear: e.endYear,
                  grade: e.grade,
                  coursework: [],
                  achievements: [],
                })),
            ];
          }

          if (sel.has("projects")) {
            next.projects = [
              ...d.projects,
              ...extracted.projects
                .filter((p) => (p.name ?? "").trim())
                .map((p) => ({
                  id: uid(),
                  name: p.name ?? "",
                  category: p.category,
                  description: p.description,
                  image: undefined,
                  role: undefined,
                  technologies: p.technologies ?? [],
                  features: [],
                  githubUrl: isHttp(p.githubUrl) ? p.githubUrl!.trim() : undefined,
                  liveUrl: isHttp(p.liveUrl) ? p.liveUrl!.trim() : undefined,
                  featured: false,
                })),
            ];
          }

          if (sel.has("skills")) {
            next.skills = [
              ...d.skills,
              ...extracted.skills
                .filter((g) => (g.items ?? []).length > 0)
                .map((g) => ({
                  id: uid(),
                  category: g.category?.trim() || "Skills",
                  items: (g.items ?? []).filter(Boolean).map((name) => ({ name })),
                })),
            ];
          }

          if (sel.has("certifications")) {
            next.certifications = [
              ...d.certifications,
              ...extracted.certifications
                .filter((c) => (c.name ?? "").trim())
                .map((c) => ({
                  id: uid(),
                  name: c.name ?? "",
                  issuer: c.issuer,
                  issueDate: c.issueDate,
                  credentialId: undefined,
                  credentialUrl: undefined,
                  image: undefined,
                })),
            ];
          }

          if (sel.has("achievements")) {
            next.achievements = [
              ...d.achievements,
              ...extracted.achievements
                .filter((a) => (a.title ?? "").trim())
                .map((a) => ({
                  id: uid(),
                  title: a.title ?? "",
                  description: a.description,
                  date: a.date,
                  organization: a.organization,
                  url: undefined,
                })),
            ];
          }

          if (sel.has("socials")) {
            next.socials = [
              ...d.socials,
              ...extracted.socials
                .filter((x) => (x.url ?? "").trim())
                .map((x) => {
                  const platform = (x.platform && SOCIAL_PLATFORMS.has(x.platform as Social["platform"])
                    ? x.platform
                    : "custom") as Social["platform"];
                  return { id: uid(), platform, label: x.label, url: (x.url ?? "").trim() };
                }),
            ];
          }

          return { data: next, lastSavedAt: stamp() };
        }),

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
