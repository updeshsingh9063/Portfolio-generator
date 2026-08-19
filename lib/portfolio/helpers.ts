import type { PortfolioData, SectionKey } from "./schema";

/** Whether a section has any content worth rendering. */
export function sectionHasData(data: PortfolioData, key: SectionKey): boolean {
  switch (key) {
    case "about":
      return Boolean(data.about?.trim() || data.profile.about?.trim());
    case "projects":
      return data.projects.length > 0;
    case "services":
      return data.services.length > 0;
    case "experience":
      return data.experience.length > 0;
    case "education":
      return data.education.length > 0;
    case "skills":
      return data.skills.length > 0;
    case "certifications":
      return data.certifications.length > 0;
    case "achievements":
      return data.achievements.length > 0;
    case "testimonials":
      return data.testimonials.length > 0;
    case "contact":
      return true; // the closing contact/footer is always shown
  }
}

/** Ordered list of sections to render: respects order, drops hidden + empty. */
export function orderedVisibleSections(data: PortfolioData): SectionKey[] {
  const hidden = new Set(data.settings.hiddenSections);
  return data.settings.sectionOrder.filter(
    (key) => !hidden.has(key) && sectionHasData(data, key)
  );
}

/** Human labels for section anchors / nav. */
export const SECTION_LABELS: Record<SectionKey, string> = {
  about: "About",
  projects: "Works",
  services: "Services",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  testimonials: "Words",
  contact: "Contact",
};

/** Initials for monograms / avatar fallbacks. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
