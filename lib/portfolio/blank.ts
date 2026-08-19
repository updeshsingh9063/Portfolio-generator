import type {
  Achievement,
  Certification,
  Education,
  Experience,
  PortfolioData,
  Project,
  Social,
  SkillGroup,
} from "./schema";

/** Short unique id for draft entries. */
export function uid(prefix = ""): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}${rand}`;
}

export function newEducation(): Education {
  return {
    id: uid("ed_"),
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    grade: "",
    coursework: [],
    achievements: [],
  };
}

export function newExperience(): Experience {
  return {
    id: uid("ex_"),
    company: "",
    title: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    responsibilities: [],
    achievements: [],
    technologies: [],
  };
}

export function newProject(): Project {
  return {
    id: uid("pr_"),
    name: "",
    category: "",
    description: "",
    image: "",
    role: "",
    technologies: [],
    features: [],
    githubUrl: undefined,
    liveUrl: undefined,
    featured: false,
  };
}

export function newSkillGroup(): SkillGroup {
  return { id: uid("sk_"), category: "", items: [] };
}

export function newCertification(): Certification {
  return {
    id: uid("ce_"),
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: undefined,
    image: "",
  };
}

export function newAchievement(): Achievement {
  return { id: uid("ac_"), title: "", description: "", date: "", organization: "", url: undefined };
}

export function newSocial(): Social {
  return { id: uid("so_"), platform: "linkedin", label: "", url: "" };
}

/** A fresh, empty portfolio draft. */
export function blankPortfolio(): PortfolioData {
  return {
    profile: {
      fullName: "",
      headline: "",
      heroWord: "Portfolio",
      roleLabel: "",
      kicker: "",
      avatar: "",
      bio: "",
      about: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      currentStatus: "",
      tagline: "",
      availableForWork: false,
      availabilityLabel: "Available for work",
      resumeUrl: undefined,
    },
    socials: [],
    about: "",
    projects: [],
    services: [],
    process: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: [],
    testimonials: [],
    settings: {
      templateId: "atelier",
      theme: "light",
      accent: undefined,
      fontPreset: "editorial",
      animationIntensity: "subtle",
      sectionOrder: [
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
      ],
      hiddenSections: [],
    },
  };
}
