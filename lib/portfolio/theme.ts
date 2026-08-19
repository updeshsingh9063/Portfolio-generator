/** Accent presets a user can choose. Each overrides the bronze default. */
export interface AccentPreset {
  id: string;
  name: string;
  accent: string;
  deep: string;
  bright: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: "bronze", name: "Bronze", accent: "#b4906b", deep: "#8a6b4a", bright: "#c79a72" },
  { id: "olive", name: "Olive", accent: "#8a8a5c", deep: "#63633e", bright: "#a3a374" },
  { id: "terracotta", name: "Terracotta", accent: "#c07a55", deep: "#96583a", bright: "#d3936f" },
  { id: "slate", name: "Slate", accent: "#6b7d8a", deep: "#495a66", bright: "#8697a3" },
  { id: "plum", name: "Plum", accent: "#8a6b7d", deep: "#664c5a", bright: "#a3839a" },
  { id: "forest", name: "Forest", accent: "#5f7d63", deep: "#425c46", bright: "#7d9a80" },
];

export function accentPreset(id?: string): AccentPreset | undefined {
  return ACCENT_PRESETS.find((p) => p.id === id);
}

/** CSS variable overrides for a chosen accent (applied on the portfolio root). */
export function accentStyle(id?: string): React.CSSProperties {
  const p = accentPreset(id);
  if (!p) return {};
  return {
    ["--color-accent" as string]: p.accent,
    ["--color-accent-deep" as string]: p.deep,
    ["--color-accent-bright" as string]: p.bright,
  };
}

/** Font presets swap the display face using already-loaded families. */
export const FONT_PRESETS = [
  { id: "editorial", name: "Editorial", note: "Playfair Display", display: "var(--font-playfair), Georgia, serif" },
  { id: "classic", name: "Classic", note: "Cormorant", display: "var(--font-cormorant), Georgia, serif" },
  { id: "modern", name: "Modern", note: "Inter", display: "var(--font-inter), system-ui, sans-serif" },
] as const;

export function fontStyle(preset?: string): React.CSSProperties {
  const p = FONT_PRESETS.find((f) => f.id === preset);
  if (!p || p.id === "editorial") return {};
  return { ["--font-display" as string]: p.display };
}
