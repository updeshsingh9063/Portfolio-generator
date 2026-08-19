import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const img = (s, w, h, g) => `https://picsum.photos/seed/${s}/${w}/${h}${g ? "?grayscale" : ""}`;

const content = {
  profile: {
    fullName: "Alyssa Marlowe",
    headline: "Web & UI Designer",
    heroWord: "Portfolio",
    roleLabel: "UI Designer",
    kicker: "Creative",
    avatar: img("alyssa-portrait", 900, 1200, true),
    bio: "I design thoughtful digital experiences that combine strategy, aesthetics, and clarity to help brands stand out.",
    about:
      "For the past eight years I've partnered with founders and studios to shape brands and the digital products that carry them.",
    location: "New York, USA",
    email: "hello@alyssamarlowe.design",
    phone: "+1 (555) 123-4567",
    website: "www.alyssamarlowe.com",
    currentStatus: "Available for freelance",
    tagline: "Design that feels inevitable.",
    availableForWork: true,
    availabilityLabel: "Available for freelance projects",
  },
  socials: [
    { id: "s1", platform: "instagram", label: "@alyssamarlowe.design", url: "https://instagram.com/alyssamarlowe.design" },
    { id: "s2", platform: "behance", label: "behance.net/alyssamarlowe", url: "https://behance.net/alyssamarlowe" },
    { id: "s3", platform: "linkedin", label: "in/alyssamarlowe", url: "https://linkedin.com/in/alyssamarlowe" },
    { id: "s4", platform: "dribbble", label: "dribbble.com/alyssamarlowe", url: "https://dribbble.com/alyssamarlowe" },
  ],
  projects: [
    { id: "p1", name: "Velure", category: "Fashion Brand · Web Design", description: "A luxury fashion label's digital flagship — editorial storefront with immersive lookbooks.", image: img("velure", 900, 1100, true), technologies: ["Figma", "Webflow", "GSAP"], features: [], liveUrl: "https://example.com", featured: true },
    { id: "p2", name: "Calm by Design", category: "Interior Studio · Web Design", description: "A serene digital home for an interior practice.", image: img("calm", 900, 1100), technologies: ["Figma", "Next.js"], features: [], liveUrl: "https://example.com", featured: true },
    { id: "p3", name: "Savor", category: "Restaurant · Web Design", description: "Immersive storytelling for a fine-dining brand.", image: img("savor", 900, 1100, true), technologies: ["Figma", "React"], features: [], liveUrl: "https://example.com", featured: true },
    { id: "p4", name: "Forma Studio", category: "Architecture Firm · Web Design", description: "An architecture firm's portfolio built on a strict grid.", image: img("forma", 900, 1100), technologies: ["Figma", "Astro"], features: [], liveUrl: "https://example.com", featured: true },
  ],
  services: [
    { id: "sv1", title: "Web Design", description: "Custom, responsive website design." },
    { id: "sv2", title: "UI / UX Design", description: "Intuitive interfaces that engage." },
    { id: "sv3", title: "Brand Experience", description: "Visual systems that tell your story." },
    { id: "sv4", title: "Design Strategy", description: "From concept to measurable impact." },
  ],
  process: [
    { id: "pr1", title: "Discover", description: "Understanding your brand, audience, and goals." },
    { id: "pr2", title: "Design", description: "Crafting wireframes and visual concepts." },
    { id: "pr3", title: "Develop", description: "Bringing the design to life with precision." },
    { id: "pr4", title: "Deliver", description: "Testing, refining, and launching with care." },
  ],
  experience: [],
  education: [],
  skills: [
    { id: "sk1", category: "Design", items: [{ name: "UI / Visual Design", level: 95 }, { name: "Art Direction", level: 90 }, { name: "Design Systems", level: 88 }] },
    { id: "sk2", category: "Tools", items: [{ name: "Figma" }, { name: "Framer" }, { name: "Webflow" }] },
  ],
  certifications: [],
  achievements: [],
  testimonials: [
    { id: "t1", quote: "Good design is not just how it looks, it's how it works and how it makes people feel.", author: "Priya Nair", role: "Founder, Velure", image: img("testimonial", 900, 900, true) },
  ],
  settings: { templateId: "atelier", theme: "light", fontPreset: "editorial", animationIntensity: "subtle", accent: "bronze", sectionOrder: ["about", "projects", "services", "experience", "education", "skills", "certifications", "achievements", "testimonials", "contact"], hiddenSections: [] },
};

const email = "test@folio.local";
const passwordHash = await bcrypt.hash("password123", 10);
const user = await prisma.user.upsert({
  where: { email },
  update: {},
  create: { name: "Test User", email, passwordHash },
});

const slug = "alyssa-demo";
await prisma.portfolio.upsert({
  where: { slug },
  update: { content, published: true, publishedAt: new Date(), title: "Alyssa Marlowe — Web & UI Designer" },
  create: { userId: user.id, slug, title: "Alyssa Marlowe — Web & UI Designer", templateId: "atelier", content, published: true, publishedAt: new Date() },
});

console.log("Seeded portfolio /" + slug + " for user", user.id);
await prisma.$disconnect();
