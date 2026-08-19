import type { PortfolioData, SectionKey } from "@/lib/portfolio/schema";
import { orderedVisibleSections } from "@/lib/portfolio/helpers";
import { AnimationProvider } from "./AnimationProvider";

import { Header } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Works } from "./Works";
import { ServicesProcess } from "./ServicesProcess";
import { Experience } from "./Experience";
import { Education } from "./Education";
import { Skills } from "./Skills";
import { Certifications } from "./Certifications";
import { Achievements } from "./Achievements";
import { Testimonials } from "./Testimonials";
import { Contact } from "./Contact";

/** Fixed year so server/client render identically (no hydration mismatch). */
const YEAR = 2026;

const SECTION_COMPONENTS: Partial<
  Record<SectionKey, (props: { data: PortfolioData }) => React.ReactNode>
> = {
  about: About,
  projects: Works,
  services: ServicesProcess,
  experience: Experience,
  education: Education,
  skills: Skills,
  certifications: Certifications,
  achievements: Achievements,
  testimonials: Testimonials,
};

/**
 * Flagship editorial template — reproduces the reference design, fully
 * data-driven. Sections with no data are omitted; order follows settings.
 */
export function AtelierTemplate({ data }: { data: PortfolioData }) {
  const sections = orderedVisibleSections(data);
  const bodySections = sections.filter((s) => s !== "contact");

  return (
    <AnimationProvider intensity={data.settings.animationIntensity}>
      <div className="grain bg-paper">
        <Header data={data} sections={sections} year={YEAR} />
        <Hero data={data} />
        {bodySections.map((key) => {
          const Component = SECTION_COMPONENTS[key];
          return Component ? <Component key={key} data={data} /> : null;
        })}
        <Contact data={data} year={YEAR} />
      </div>
    </AnimationProvider>
  );
}
