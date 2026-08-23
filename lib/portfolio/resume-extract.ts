import { z } from "zod";

/* ============================================================================
   RÉSUMÉ EXTRACTION SHAPE
   A deliberately loose, id-free shape the LLM fills from résumé text. It maps
   onto the real PortfolioData in the store's importData() action, which adds
   ids and merges into the draft. Everything is optional so partial résumés and
   imperfect extraction still validate.
   ========================================================================== */

const str = z.string().trim().catch("");
const strArray = z.array(z.string().trim()).catch([]);

export const extractedProfileSchema = z
  .object({
    fullName: str.optional(),
    headline: str.optional(),
    email: str.optional(),
    phone: str.optional(),
    location: str.optional(),
    website: str.optional(),
    bio: str.optional(),
    about: str.optional(),
  })
  .partial();

export const extractedExperienceSchema = z.object({
  company: str.optional(),
  title: str.optional(),
  employmentType: str.optional(),
  location: str.optional(),
  startDate: str.optional(),
  endDate: str.optional(),
  current: z.boolean().catch(false).optional(),
  responsibilities: strArray.optional(),
  technologies: strArray.optional(),
});

export const extractedEducationSchema = z.object({
  institution: str.optional(),
  degree: str.optional(),
  field: str.optional(),
  startYear: str.optional(),
  endYear: str.optional(),
  grade: str.optional(),
});

export const extractedProjectSchema = z.object({
  name: str.optional(),
  category: str.optional(),
  description: str.optional(),
  technologies: strArray.optional(),
  liveUrl: str.optional(),
  githubUrl: str.optional(),
});

export const extractedSkillGroupSchema = z.object({
  category: str.optional(),
  items: strArray.optional(),
});

export const extractedCertificationSchema = z.object({
  name: str.optional(),
  issuer: str.optional(),
  issueDate: str.optional(),
});

export const extractedAchievementSchema = z.object({
  title: str.optional(),
  description: str.optional(),
  organization: str.optional(),
  date: str.optional(),
});

export const extractedSocialSchema = z.object({
  platform: str.optional(),
  label: str.optional(),
  url: str.optional(),
});

export const extractedResumeSchema = z.object({
  profile: extractedProfileSchema.optional().default({}),
  experience: z.array(extractedExperienceSchema).catch([]).default([]),
  education: z.array(extractedEducationSchema).catch([]).default([]),
  projects: z.array(extractedProjectSchema).catch([]).default([]),
  skills: z.array(extractedSkillGroupSchema).catch([]).default([]),
  certifications: z.array(extractedCertificationSchema).catch([]).default([]),
  achievements: z.array(extractedAchievementSchema).catch([]).default([]),
  socials: z.array(extractedSocialSchema).catch([]).default([]),
});

export type ExtractedResume = z.infer<typeof extractedResumeSchema>;

/** Section keys the review UI offers as toggles. */
export const IMPORT_SECTIONS = [
  "profile",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "socials",
] as const;

export type ImportSection = (typeof IMPORT_SECTIONS)[number];

/** How many items each extracted section carries (for the review screen). */
export function importCounts(data: ExtractedResume): Record<ImportSection, number> {
  const profileFilled = Object.values(data.profile ?? {}).filter(
    (v) => typeof v === "string" && v.trim().length > 0
  ).length;
  return {
    profile: profileFilled,
    experience: data.experience.length,
    education: data.education.length,
    projects: data.projects.length,
    skills: data.skills.length,
    certifications: data.certifications.length,
    achievements: data.achievements.length,
    socials: data.socials.length,
  };
}
