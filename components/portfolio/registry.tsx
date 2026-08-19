import type { PortfolioData } from "@/lib/portfolio/schema";
import { AtelierTemplate } from "./templates/atelier/AtelierTemplate";

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  /** Persona this template suits best — used on the template picker. */
  bestFor: string;
  component: (props: { data: PortfolioData }) => React.ReactNode;
}

/**
 * The template registry. Every template shares the PortfolioData shape but
 * renders a completely different visual identity. New templates (Modern
 * Developer, Dark Tech, …) register here — the dynamic route stays unchanged.
 */
export const TEMPLATES: Record<string, TemplateMeta> = {
  atelier: {
    id: "atelier",
    name: "Atelier",
    description: "Editorial, warm, and typographic — a fashion-magazine portfolio.",
    bestFor: "Designers · Creatives · Studios",
    component: AtelierTemplate,
  },
};

export const DEFAULT_TEMPLATE = "atelier";

export function getTemplate(id?: string): TemplateMeta {
  return TEMPLATES[id ?? ""] ?? TEMPLATES[DEFAULT_TEMPLATE];
}

export function listTemplates(): TemplateMeta[] {
  return Object.values(TEMPLATES);
}
