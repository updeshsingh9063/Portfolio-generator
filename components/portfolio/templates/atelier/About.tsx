import { ArrowUpRight } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio/schema";
import { AtelierSection } from "./parts";
import { Reveal } from "@/components/portfolio/shared/reveal";

export function About({ data }: { data: PortfolioData }) {
  const { profile } = data;
  const body = data.about?.trim() || profile.about?.trim();
  if (!body) return null;

  return (
    <AtelierSection id="about" tone="paper">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Reveal>
            <p className="overline">About</p>
          </Reveal>
        </div>
        <div className="lg:col-span-9">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.3] tracking-[-0.01em] text-foreground text-balance">
              {body}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-center gap-2 text-small font-medium text-foreground"
                >
                  {profile.email}
                  <ArrowUpRight className="size-4 text-accent-deep transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-caption font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground"
                >
                  Download résumé
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </AtelierSection>
  );
}
