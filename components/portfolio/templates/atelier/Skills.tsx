import type { PortfolioData, SkillGroup } from "@/lib/portfolio/schema";
import { AtelierSection, SectionHeader } from "./parts";
import { RevealGroup, RevealItem } from "@/components/portfolio/shared/reveal";
import { SkillMeter } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";

function Group({ group }: { group: SkillGroup }) {
  const hasLevels = group.items.some((i) => typeof i.level === "number");
  return (
    <RevealItem>
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 border-t border-line py-8 sm:grid-cols-[10rem_1fr] first:border-t-0 first:pt-0">
        <h3 className="text-caption font-semibold uppercase tracking-[0.18em] text-accent-deep">
          {group.category}
        </h3>
        {hasLevels ? (
          <div className="flex flex-col gap-5">
            {group.items.map((item) => (
              <SkillMeter key={item.name} label={item.name} value={item.level ?? 70} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {group.items.map((item) => (
              <Badge key={item.name} variant="outline" size="md" pill>
                {item.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </RevealItem>
  );
}

export function Skills({ data }: { data: PortfolioData }) {
  return (
    <AtelierSection id="skills" tone="paper">
      <SectionHeader label="Skills & Tools" />
      <RevealGroup>
        {data.skills.map((group) => (
          <Group key={group.id} group={group} />
        ))}
      </RevealGroup>
    </AtelierSection>
  );
}
