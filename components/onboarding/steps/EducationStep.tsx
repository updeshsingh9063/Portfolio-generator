"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { newEducation } from "@/lib/portfolio/blank";
import { StepIntro, FieldGrid, SectionList } from "@/components/onboarding/step-shell";
import { EntryCard, AddEntryButton } from "@/components/onboarding/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { GraduationCap } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";

export function EducationStep({ index }: { index: number }) {
  const items = useOnboarding((s) => s.data.education);
  const add = useOnboarding((s) => s.addEntry);
  const update = useOnboarding((s) => s.updateEntry);
  const remove = useOnboarding((s) => s.removeEntry);

  return (
    <div>
      <StepIntro
        index={index}
        title="Education"
        subtitle="Add your degrees and programs. Skip this if it's not relevant — empty sections never appear on your portfolio."
        optional
      />

      <SectionList>
        {items.length === 0 && (
          <EmptyState
            icon={<GraduationCap />}
            title="No education added yet"
            description="Add a school, bootcamp, or program — or skip this step entirely."
          />
        )}

        {items.map((ed, i) => (
          <EntryCard
            key={ed.id}
            index={i}
            title={ed.institution || `Education ${String(i + 1).padStart(2, "0")}`}
            onRemove={() => remove("education", ed.id)}
          >
            <FieldGrid>
              <FormField label="College / University">
                <Input value={ed.institution} onChange={(e) => update("education", ed.id, { institution: e.target.value })} placeholder="Rhode Island School of Design" />
              </FormField>
              <FormField label="Degree">
                <Input value={ed.degree} onChange={(e) => update("education", ed.id, { degree: e.target.value })} placeholder="BFA" />
              </FormField>
              <FormField label="Field / Specialization">
                <Input value={ed.field} onChange={(e) => update("education", ed.id, { field: e.target.value })} placeholder="Graphic Design" />
              </FormField>
              <FormField label="Grade / CGPA">
                <Input value={ed.grade} onChange={(e) => update("education", ed.id, { grade: e.target.value })} placeholder="3.9 / 4.0" />
              </FormField>
              <FormField label="Start year">
                <Input value={ed.startYear} onChange={(e) => update("education", ed.id, { startYear: e.target.value })} placeholder="2013" />
              </FormField>
              <FormField label="End year">
                <Input value={ed.endYear} onChange={(e) => update("education", ed.id, { endYear: e.target.value })} placeholder="2017" />
              </FormField>
            </FieldGrid>
            <div className="mt-5 grid grid-cols-1 gap-5">
              <FormField label="Relevant coursework">
                <TagInput value={ed.coursework} onChange={(v) => update("education", ed.id, { coursework: v })} placeholder="Add a course and press Enter" />
              </FormField>
              <FormField label="Achievements">
                <TagInput value={ed.achievements} onChange={(v) => update("education", ed.id, { achievements: v })} placeholder="Dean's List, scholarships…" />
              </FormField>
            </div>
          </EntryCard>
        ))}

        <AddEntryButton label="Add education" onClick={() => add("education", newEducation())} />
      </SectionList>
    </div>
  );
}
