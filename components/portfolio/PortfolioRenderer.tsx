import type { PortfolioData } from "@/lib/portfolio/schema";
import { getTemplate } from "./registry";
import { accentStyle, fontStyle } from "@/lib/portfolio/theme";

/**
 * Renders a portfolio through its selected template. This is the single entry
 * point used by the public route, the editor preview, and OG generation.
 * A chosen accent preset is applied as CSS-variable overrides on the root.
 */
export function PortfolioRenderer({ data }: { data: PortfolioData }) {
  const template = getTemplate(data.settings.templateId);
  const Template = template.component;
  const style = { ...accentStyle(data.settings.accent), ...fontStyle(data.settings.fontPreset) };

  return (
    <div style={style}>
      <Template data={data} />
    </div>
  );
}
