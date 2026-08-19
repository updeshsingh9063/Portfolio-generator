  import { z } from "zod";

/* ============================================================================
   PORTFOLIO DATA MODEL — the single source of truth.
   The onboarding form, live preview, AI enhancement, and every template all
   read and write this exact shape. Content is separated from presentation
   (see `settings`) so one dataset renders through any template.
   ========================================================================== */

const url = z.string().trim().url();
const optionalUrl = z
  .string()
  .trim()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

/* ------------------------------- primitives ------------------------------- */

export const socialSchema = z.object({
  id: z.string(),
  platform: z.enum([
    "linkedin",
    "github",
    "twitter",
    "instagram",
    "youtube",
    "behance",
    "dribbble",
    "medium",
    "kaggle",
    "leetcode",
    "stackoverflow",
    "website",
    "email",
    "custom",
  ]),
  label: z.string().optional(),
  url: z.string().trim(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string().optional(),
  field: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  grade: z.string().optional(),
  coursework: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  employmentType: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  role: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().default(false),
});

export const skillGroupSchema = z.object({
  id: z.string(),
  category: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      level: z.number().min(0).max(100).optional(),
    })
  ),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: optionalUrl,
  image: z.string().optional(),
});

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  organization: z.string().optional(),
  url: optionalUrl,
});

export const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string().optional(),
  role: z.string().optional(),
  image: z.string().optional(),
});

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const processStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

/* -------------------------------- profile --------------------------------- */

export const profileSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  /** Big editorial word in the hero (defaults to "Portfolio"). */
  heroWord: z.string().optional(),
  /** Tiny tracked role label in the header, e.g. "UI DESIGNER". */
  roleLabel: z.string().optional(),
  /** Overline above the headline, e.g. "CREATIVE". */
  kicker: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  currentStatus: z.string().optional(),
  tagline: z.string().optional(),
  availableForWork: z.boolean().default(false),
  availabilityLabel: z.string().optional(),
  resumeUrl: optionalUrl,
});

/* -------------------------------- settings -------------------------------- */

export const SECTION_KEYS = [
  "about",
  "projects",
  "services",
  "experience",
  "education",
  "skills",
  "certifications",
  "achievements",
  "testimonials",
  "contact",
] as const;

export const sectionKeySchema = z.enum(SECTION_KEYS);

export const settingsSchema = z.object({
  templateId: z.string().default("atelier"),
  theme: z.enum(["light", "dark"]).default("light"),
  accent: z.string().optional(),
  fontPreset: z.enum(["editorial", "modern", "classic"]).default("editorial"),
  animationIntensity: z.enum(["none", "subtle", "expressive"]).default("subtle"),
  sectionOrder: z.array(sectionKeySchema).default([...SECTION_KEYS]),
  hiddenSections: z.array(sectionKeySchema).default([]),
});

/* ------------------------------ full portfolio ---------------------------- */

export const portfolioDataSchema = z.object({
  profile: profileSchema,
  socials: z.array(socialSchema).default([]),
  about: z.string().optional(),
  projects: z.array(projectSchema).default([]),
  services: z.array(serviceSchema).default([]),
  process: z.array(processStepSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
  settings: settingsSchema,
});

/* --------------------------------- types ---------------------------------- */

export type Social = z.infer<typeof socialSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type PortfolioSettings = z.infer<typeof settingsSchema>;
export type SectionKey = (typeof SECTION_KEYS)[number];
export type PortfolioData = z.infer<typeof portfolioDataSchema>;
