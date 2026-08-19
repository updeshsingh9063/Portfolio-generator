"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { newAchievement } from "@/lib/portfolio/blank";
import { StepIntro, FieldGrid, SectionList } from "@/components/onboarding/step-shell";
import { EntryCard, AddEntryButton } from "@/components/onboarding/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Award } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";

export function AchievementsStep({ index }: { index: number }) {
  const items = useOnboarding((s) => s.data.achievements);
  const add = useOnboarding((s) => s.addEntry);
  const update = useOnboarding((s) => s.updateEntry);
  const remove = useOnboarding((s) => s.removeEntry);

  return (
    <div>
      <StepIntro
        index={index}
        title="Achievements"
        subtitle="Awards, talks, hackathons, and standout moments."
        optional
      />

      <SectionList>
        {items.length === 0 && (
          <EmptyState
            icon={<Award />}
            title="No achievements yet"
            description="Add an award or highlight — or skip this step."
          />
        )}

        {items.map((a, i) => (
          <EntryCard
            key={a.id}
            index={i}
            title={a.title || `Achievement ${String(i + 1).padStart(2, "0")}`}
            onRemove={() => remove("achievements", a.id)}
          >
            <FieldGrid>
              <FormField label="Title">
                <Input value={a.title} onChange={(e) => update("achievements", a.id, { title: e.target.value })} placeholder="FWA Site of the Day" />
              </FormField>
              <FormField label="Organization">
                <Input value={a.organization} onChange={(e) => update("achievements", a.id, { organization: e.target.value })} placeholder="The FWA" />
              </FormField>
              <FormField label="Date">
                <Input value={a.date} onChange={(e) => update("achievements", a.id, { date: e.target.value })} placeholder="2023" />
              </FormField>
              <FormField label="Link">
                <Input value={a.url ?? ""} onChange={(e) => update("achievements", a.id, { url: e.target.value })} placeholder="https://…" />
              </FormField>
              <FormField label="Description" className="sm:col-span-2">
                <Textarea rows={3} value={a.description} onChange={(e) => update("achievements", a.id, { description: e.target.value })} placeholder="A sentence about what you achieved." />
              </FormField>
            </FieldGrid>
          </EntryCard>
        ))}

        <AddEntryButton label="Add achievement" onClick={() => add("achievements", newAchievement())} />
      </SectionList>
    </div>
  );
}
