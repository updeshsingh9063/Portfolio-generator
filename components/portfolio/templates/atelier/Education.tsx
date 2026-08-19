import type { PortfolioData } from "@/lib/portfolio/schema";
import { AtelierSection, SectionHeader } from "./parts";
import { RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";
import { Badge } from "@/components/ui/badge";

export function Education({ data }: { data: PortfolioData }) {
  return (
    <AtelierSection id="education" tone="surface">
      <SectionHeader label="Education" />
      <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.education.map((ed) => (
          <RevealItem key={ed.id}>
            <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-paper p-7">
              <span className="text-caption uppercase tracking-[0.16em] text-faint tabular-nums">
                {[ed.startYear, ed.endYear].filter(Boolean).join(" — ")}
              </span>
              <h3 className="mt-3 font-display text-h4 text-foreground">{ed.institution}</h3>
              <p className="mt-1 text-[0.95rem] text-muted">
                {[ed.degree, ed.field].filter(Boolean).join(", ")}
              </p>
              {ed.grade && (
                <p className="mt-1 text-small text-accent-deep">{ed.grade}</p>
              )}
              {ed.coursework.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {ed.coursework.map((c) => (
                    <Badge key={c} variant="muted" size="sm">
                      {c}
                    </Badge>
                  ))}
                </div>
              )}
              {ed.achievements.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1.5">
                  {ed.achievements.map((a, i) => (
                    <li key={i} className="flex gap-2.5 text-small text-muted">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </AtelierSection>
  );
}
