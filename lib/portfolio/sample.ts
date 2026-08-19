import type { PortfolioData } from "./schema";

/** Deterministic placeholder imagery (loads reliably; users replace with uploads). */
const img = (seed: string, w: number, h: number, grayscale = false) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}${grayscale ? "?grayscale" : ""}`;

/**
 * Reproduces the editorial reference (Alyssa Marlowe, Web & UI Designer).
 * Used by the /preview route and as the seed for the flagship "Atelier" template.
 */
export const sampleData: PortfolioData = {
  profile: {
    fullName: "Alyssa Marlowe",
    headline: "Web & UI Designer",
    heroWord: "Portfolio",
    roleLabel: "UI Designer",
    kicker: "Creative",
    avatar: img("alyssa-portrait", 900, 1200, true),
    bio: "I design thoughtful digital experiences that combine strategy, aesthetics, and clarity to help brands stand out.",
    about:
      "For the past eight years I've partnered with founders and studios to shape brands and the digital products that carry them. My work lives at the intersection of editorial art direction and interface design — considered, warm, and built to convert.",
    location: "New York, USA",
    email: "hello@alyssamarlowe.design",
    phone: "+1 (555) 123-4567",
    website: "www.alyssamarlowe.com",
    currentStatus: "Available for freelance",
    tagline: "Design that feels inevitable.",
    availableForWork: true,
    availabilityLabel: "Available for freelance projects",
    resumeUrl: "https://example.com/alyssa-marlowe-cv.pdf",
  },
  socials: [
    { id: "s1", platform: "instagram", label: "@alyssamarlowe.design", url: "https://instagram.com/alyssamarlowe.design" },
    { id: "s2", platform: "behance", label: "behance.net/alyssamarlowe", url: "https://behance.net/alyssamarlowe" },
    { id: "s3", platform: "linkedin", label: "in/alyssamarlowe", url: "https://linkedin.com/in/alyssamarlowe" },
    { id: "s4", platform: "dribbble", label: "dribbble.com/alyssamarlowe", url: "https://dribbble.com/alyssamarlowe" },
  ],
  projects: [
    {
      id: "p1",
      name: "Velure",
      category: "Fashion Brand · Web Design",
      description:
        "A luxury fashion label needed a digital flagship as considered as its garments. We built an editorial storefront with immersive lookbooks and a whisper-quiet checkout.",
      image: img("velure", 900, 1100, true),
      role: "Art Direction · UI Design",
      technologies: ["Figma", "Webflow", "GSAP"],
      features: ["Editorial lookbook", "Motion system", "Headless commerce"],
      liveUrl: "https://example.com/velure",
      featured: true,
    },
    {
      id: "p2",
      name: "Calm by Design",
      category: "Interior Studio · Web Design",
      description:
        "A serene digital home for an interior practice — generous whitespace, slow transitions, and a portfolio that lets the rooms breathe.",
      image: img("calm", 900, 1100),
      role: "UX · UI Design",
      technologies: ["Figma", "Next.js"],
      features: ["Project index", "Journal", "Enquiry flow"],
      liveUrl: "https://example.com/calm",
      featured: true,
    },
    {
      id: "p3",
      name: "Savor",
      category: "Restaurant · Web Design",
      description:
        "Immersive storytelling for a fine-dining brand, pairing full-bleed photography with a reservation experience that feels like being welcomed in.",
      image: img("savor", 900, 1100, true),
      role: "Brand · Web Design",
      technologies: ["Figma", "Sanity", "React"],
      features: ["Seasonal menu", "Reservations", "Chef's story"],
      liveUrl: "https://example.com/savor",
      featured: true,
    },
    {
      id: "p4",
      name: "Forma Studio",
      category: "Architecture Firm · Web Design",
      description:
        "An architecture firm's portfolio built on a strict grid — quiet typography, precise imagery, and case studies that read like monographs.",
      image: img("forma", 900, 1100),
      role: "Design System · UI",
      technologies: ["Figma", "Astro"],
      features: ["Grid system", "Case studies", "Awards wall"],
      liveUrl: "https://example.com/forma",
      featured: true,
    },
  ],
  services: [
    { id: "sv1", title: "Web Design", description: "Custom, responsive website design.", icon: "layout" },
    { id: "sv2", title: "UI / UX Design", description: "Intuitive interfaces that engage.", icon: "figma" },
    { id: "sv3", title: "Brand Experience", description: "Visual systems that tell your story.", icon: "sparkles" },
    { id: "sv4", title: "Design Strategy", description: "From concept to measurable impact.", icon: "compass" },
  ],
  process: [
    { id: "pr1", title: "Discover", description: "Understanding your brand, audience, and goals." },
    { id: "pr2", title: "Design", description: "Crafting wireframes and visual concepts." },
    { id: "pr3", title: "Develop", description: "Bringing the design to life with precision." },
    { id: "pr4", title: "Deliver", description: "Testing, refining, and launching with care." },
  ],
  experience: [
    {
      id: "e1",
      company: "Independent Studio",
      title: "Design Director",
      employmentType: "Freelance",
      location: "New York",
      startDate: "2021",
      endDate: "",
      current: true,
      description: "Leading brand and product design engagements for fashion, hospitality, and cultural clients.",
      responsibilities: ["Art direction end-to-end", "Design systems", "Client strategy workshops"],
      achievements: ["Grew retainer revenue 3×", "Two FWA site-of-the-day awards"],
      technologies: ["Figma", "Webflow", "Framer"],
    },
    {
      id: "e2",
      company: "Meridian Agency",
      title: "Senior Product Designer",
      employmentType: "Full-time",
      location: "New York",
      startDate: "2017",
      endDate: "2021",
      current: false,
      description: "Owned interface design for flagship commerce and editorial clients.",
      responsibilities: ["Led a pod of 3 designers", "Design QA", "Prototyping"],
      achievements: ["+22% conversion on flagship redesign"],
      technologies: ["Figma", "Sketch", "Principle"],
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "Rhode Island School of Design",
      degree: "BFA",
      field: "Graphic Design",
      startYear: "2013",
      endYear: "2017",
      grade: "",
      coursework: ["Typography", "Interaction Design", "Motion"],
      achievements: ["Dean's List"],
    },
  ],
  skills: [
    {
      id: "sk1",
      category: "Design",
      items: [
        { name: "UI / Visual Design", level: 95 },
        { name: "Art Direction", level: 90 },
        { name: "Design Systems", level: 88 },
        { name: "Prototyping", level: 82 },
      ],
    },
    {
      id: "sk2",
      category: "Tools",
      items: [
        { name: "Figma" },
        { name: "Framer" },
        { name: "Webflow" },
        { name: "After Effects" },
        { name: "Blender" },
      ],
    },
    {
      id: "sk3",
      category: "Build",
      items: [{ name: "HTML / CSS" }, { name: "React" }, { name: "GSAP" }, { name: "Tailwind" }],
    },
  ],
  certifications: [
    {
      id: "c1",
      name: "Interaction Design Specialization",
      issuer: "UC San Diego",
      issueDate: "2020",
      credentialId: "IDX-2291",
      credentialUrl: "https://example.com/cert",
    },
  ],
  achievements: [
    {
      id: "a1",
      title: "FWA Site of the Day",
      description: "Awarded twice for editorial commerce work.",
      date: "2023",
      organization: "The FWA",
      url: "https://thefwa.com",
    },
    {
      id: "a2",
      title: "Speaker — Config",
      description: "Talk on editorial systems in interface design.",
      date: "2022",
      organization: "Figma Config",
    },
  ],
  testimonials: [
    {
      id: "t1",
      quote: "Good design is not just how it looks, it's how it works and how it makes people feel.",
      author: "Priya Nair",
      role: "Founder, Velure",
      image: img("testimonial", 900, 900, true),
    },
  ],
  settings: {
    templateId: "atelier",
    theme: "light",
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
