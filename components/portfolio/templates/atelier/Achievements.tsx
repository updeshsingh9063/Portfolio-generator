import { ArrowUpRight, Award } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio/schema";
import { AtelierSection, SectionHeader } from "./parts";
import { RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";

export function Achievements({ data }: { data: PortfolioData }) {
  return (
    <AtelierSection id="achievements" tone="paper">
      <SectionHeader label="Achievements" />
      <RevealGroup>
        {data.achievements.map((a) => {
          const Wrapper = a.url ? "a" : "div";
          return (
            <RevealItem key={a.id}>
              <Wrapper
                {...(a.url ? { href: a.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group grid grid-cols-1 gap-x-8 gap-y-2 border-t border-line py-7 sm:grid-cols-[8rem_1fr_auto] first:border-t-0 first:pt-0"
              >
                <span className="text-caption uppercase tracking-[0.16em] text-faint tabular-nums">
                  {a.date}
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <Award className="size-4 text-accent-deep" strokeWidth={1.5} />
                    <h3 className="font-display text-h4 text-foreground">{a.title}</h3>
                  </div>
                  {a.description && <p className="mt-1.5 max-w-2xl text-small text-muted">{a.description}</p>}
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  {a.organization && (
                    <span className="text-caption uppercase tracking-[0.14em] text-muted">
                      {a.organization}
                    </span>
                  )}
                  {a.url && (
                    <ArrowUpRight className="size-4 text-faint transition-colors group-hover:text-foreground" />
                  )}
                </div>
              </Wrapper>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </AtelierSection>
  );
}
