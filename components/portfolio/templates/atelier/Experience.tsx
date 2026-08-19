import type { PortfolioData, Experience as Exp } from "@/lib/portfolio/schema";
import { AtelierSection, SectionHeader } from "./parts";
import { RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";
import { Badge } from "@/components/ui/badge";

function dateRange(e: Exp) {
  const end = e.current ? "Present" : e.endDate || "";
  return [e.startDate, end].filter(Boolean).join(" — ");
}

function ExperienceRow({ e }: { e: Exp }) {
  return (
    <RevealItem>
      <div className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-line py-8 sm:grid-cols-[10rem_1fr] first:border-t-0 first:pt-0">
        <div className="flex flex-col gap-1">
          <span className="text-caption uppercase tracking-[0.16em] text-faint tabular-nums">
            {dateRange(e)}
          </span>
          {e.employmentType && (
            <span className="text-caption text-faint">{e.employmentType}</span>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2.5">
            <h3 className="font-display text-h4 text-foreground">{e.title}</h3>
            <span className="text-muted">·</span>
            <span className="text-[0.95rem] font-medium text-accent-deep">{e.company}</span>
            {e.current && (
              <Badge variant="success" size="sm" className="ml-1">
                Current
              </Badge>
            )}
          </div>
          {e.description && <p className="mt-2 max-w-2xl text-small text-muted">{e.description}</p>}
          {e.achievements.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {e.achievements.map((a, i) => (
                <li key={i} className="flex gap-2.5 text-small text-muted">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                  {a}
                </li>
              ))}
            </ul>
          )}
          {e.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {e.technologies.map((t) => (
                <Badge key={t} variant="outline" size="sm">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </RevealItem>
  );
}

export function Experience({ data }: { data: PortfolioData }) {
  return (
    <AtelierSection id="experience" tone="paper">
      <SectionHeader label="Experience" />
      <RevealGroup>
        {data.experience.map((e) => (
          <ExperienceRow key={e.id} e={e} />
        ))}
      </RevealGroup>
    </AtelierSection>
  );
}
