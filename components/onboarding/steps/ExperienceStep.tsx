"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { newExperience } from "@/lib/portfolio/blank";
import { StepIntro, FieldGrid, SectionList } from "@/components/onboarding/step-shell";
import { EntryCard, AddEntryButton } from "@/components/onboarding/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { Toggle } from "@/components/ui/toggle";
import { AIEnhance } from "@/components/ai/enhance";

export function ExperienceStep({ index }: { index: number }) {
  const items = useOnboarding((s) => s.data.experience);
  const add = useOnboarding((s) => s.addEntry);
  const update = useOnboarding((s) => s.updateEntry);
  const remove = useOnboarding((s) => s.removeEntry);

  return (
    <div>
      <StepIntro
        index={index}
        title="Work experience"
        subtitle="Roles, internships, and freelance work. Add the most recent first."
        optional
      />

      <SectionList>
        {items.length === 0 && (
          <EmptyState
            icon={<Briefcase />}
            title="No experience added yet"
            description="Add a role — or skip if you're just getting started."
          />
        )}

        {items.map((ex, i) => (
          <EntryCard
            key={ex.id}
            index={i}
            title={ex.title || ex.company || `Role ${String(i + 1).padStart(2, "0")}`}
            onRemove={() => remove("experience", ex.id)}
          >
            <FieldGrid>
              <FormField label="Job title">
                <Input value={ex.title} onChange={(e) => update("experience", ex.id, { title: e.target.value })} placeholder="Senior Product Designer" />
              </FormField>
              <FormField label="Company">
                <Input value={ex.company} onChange={(e) => update("experience", ex.id, { company: e.target.value })} placeholder="Meridian Agency" />
              </FormField>
              <FormField label="Employment type">
                <Input value={ex.employmentType} onChange={(e) => update("experience", ex.id, { employmentType: e.target.value })} placeholder="Full-time" />
              </FormField>
              <FormField label="Location">
                <Input value={ex.location} onChange={(e) => update("experience", ex.id, { location: e.target.value })} placeholder="New York" />
              </FormField>
              <FormField label="Start date">
                <Input value={ex.startDate} onChange={(e) => update("experience", ex.id, { startDate: e.target.value })} placeholder="2017" />
              </FormField>
              <FormField label="End date">
                <Input
                  value={ex.endDate}
                  onChange={(e) => update("experience", ex.id, { endDate: e.target.value })}
                  placeholder="2021"
                  disabled={ex.current}
                />
              </FormField>
            </FieldGrid>

            <div className="mt-4 flex items-center gap-3">
              <Toggle checked={ex.current} onCheckedChange={(v) => update("experience", ex.id, { current: v })} />
              <span className="text-[0.85rem]">I currently work here</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5">
              <FormField
                label="Description"
                action={
                  <AIEnhance
                    kind="experience"
                    value={ex.description ?? ""}
                    onAccept={(t) => update("experience", ex.id, { description: t })}
                  />
                }
              >
                <Textarea value={ex.description} onChange={(e) => update("experience", ex.id, { description: e.target.value })} placeholder="What you owned and the impact you had." />
              </FormField>
              <FormField label="Key achievements">
                <TagInput value={ex.achievements} onChange={(v) => update("experience", ex.id, { achievements: v })} placeholder="+22% conversion, led a team of 3…" />
              </FormField>
              <FormField label="Technologies used">
                <TagInput value={ex.technologies} onChange={(v) => update("experience", ex.id, { technologies: v })} placeholder="Figma, React…" />
              </FormField>
            </div>
          </EntryCard>
        ))}

        <AddEntryButton label="Add experience" onClick={() => add("experience", newExperience())} />
      </SectionList>
    </div>
  );
}
