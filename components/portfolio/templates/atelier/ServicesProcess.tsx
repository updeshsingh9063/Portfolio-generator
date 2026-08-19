import {
  Layout,
  Figma,
  Sparkles,
  Compass,
  PenTool,
  Code2,
  type LucideIcon,
} from "lucide-react";
import type { PortfolioData, Service } from "@/lib/portfolio/schema";
import { AtelierSection } from "./parts";
import { Reveal, RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";

const ICONS: Record<string, LucideIcon> = {
  layout: Layout,
  figma: Figma,
  sparkles: Sparkles,
  compass: Compass,
  pen: PenTool,
  code: Code2,
};

function ServiceIcon({ icon }: { icon?: Service["icon"] }) {
  const Icon = (icon && ICONS[icon]) || PenTool;
  return <Icon className="size-5 text-accent-deep" strokeWidth={1.5} />;
}

export function ServicesProcess({ data }: { data: PortfolioData }) {
  const hasProcess = data.process.length > 0;

  return (
    <AtelierSection id="services" tone="paper">
      <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-2">
        {/* Services */}
        <div>
          <Reveal>
            <p className="overline mb-8">Services</p>
          </Reveal>
          <RevealGroup className="flex flex-col">
            {data.services.map((s) => (
              <RevealItem key={s.id}>
                <div className="flex items-start gap-4 border-t border-line py-6 first:border-t-0 first:pt-0">
                  <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full border border-line-strong">
                    <ServiceIcon icon={s.icon} />
                  </span>
                  <div>
                    <h3 className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="mt-1.5 font-serif text-lg italic leading-snug text-muted">
                        {s.description}
                      </p>
                    )}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Process */}
        {hasProcess && (
          <div>
            <Reveal>
              <p className="overline mb-8">My Process</p>
            </Reveal>
            <RevealGroup className="relative flex flex-col">
              <span className="absolute left-[1.15rem] top-2 bottom-6 w-px bg-line-strong" aria-hidden />
              {data.process.map((step, i) => (
                <RevealItem key={step.id}>
                  <div className="flex items-start gap-6 pb-8 last:pb-0">
                    <span className="relative z-10 font-display text-2xl font-medium text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                        {step.title}
                      </h3>
                      {step.description && (
                        <p className="mt-1.5 text-small text-muted">{step.description}</p>
                      )}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}
      </div>
    </AtelierSection>
  );
}
