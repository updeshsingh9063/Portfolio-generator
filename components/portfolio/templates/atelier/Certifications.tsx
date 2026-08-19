import { BadgeCheck, ArrowUpRight } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio/schema";
import { AtelierSection, SectionHeader } from "./parts";
import { RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";

export function Certifications({ data }: { data: PortfolioData }) {
  return (
    <AtelierSection id="certifications" tone="surface">
      <SectionHeader label="Certifications" />
      <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.certifications.map((c) => {
          const Wrapper = c.credentialUrl ? "a" : "div";
          return (
            <RevealItem key={c.id}>
              <Wrapper
                {...(c.credentialUrl
                  ? { href: c.credentialUrl, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-paper p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full border border-line-strong">
                    <BadgeCheck className="size-5 text-accent-deep" strokeWidth={1.5} />
                  </span>
                  {c.credentialUrl && (
                    <ArrowUpRight className="size-4 text-faint transition-colors group-hover:text-foreground" />
                  )}
                </div>
                <h3 className="font-display text-h4 leading-snug text-foreground">{c.name}</h3>
                {c.issuer && <p className="mt-1 text-small text-muted">{c.issuer}</p>}
                <div className="mt-auto flex items-center gap-3 pt-4 text-caption uppercase tracking-[0.14em] text-faint">
                  {c.issueDate && <span>{c.issueDate}</span>}
                  {c.credentialId && <span className="truncate">ID · {c.credentialId}</span>}
                </div>
              </Wrapper>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </AtelierSection>
  );
}
