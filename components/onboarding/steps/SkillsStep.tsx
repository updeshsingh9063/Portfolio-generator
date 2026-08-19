"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { newSkillGroup } from "@/lib/portfolio/blank";
import { StepIntro, SectionList } from "@/components/onboarding/step-shell";
import { EntryCard, AddEntryButton } from "@/components/onboarding/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Sparkles } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";

const SUGGESTIONS = ["Languages", "Frameworks", "Databases", "Cloud", "Tools", "Design", "AI / ML", "Soft Skills"];

export function SkillsStep({ index }: { index: number }) {
  const items = useOnboarding((s) => s.data.skills);
  const add = useOnboarding((s) => s.addEntry);
  const update = useOnboarding((s) => s.updateEntry);
  const remove = useOnboarding((s) => s.removeEntry);

  return (
    <div>
      <StepIntro
        index={index}
        title="Skills"
        subtitle="Group your skills by category — languages, frameworks, tools, and so on. They render as elegant tag sets."
      />

      <SectionList>
        {items.length === 0 && (
          <EmptyState
            icon={<Sparkles />}
            title="No skills added yet"
            description="Create a category like “Languages” or “Tools”, then add your skills."
          />
        )}

        {items.map((g, i) => (
          <EntryCard
            key={g.id}
            index={i}
            title={g.category || `Group ${String(i + 1).padStart(2, "0")}`}
            onRemove={() => remove("skills", g.id)}
          >
            <div className="grid grid-cols-1 gap-5">
              <FormField label="Category">
                <Input
                  value={g.category}
                  onChange={(e) => update("skills", g.id, { category: e.target.value })}
                  placeholder="Frameworks"
                />
              </FormField>
              <FormField label="Skills">
                <TagInput
                  value={g.items.map((it) => it.name)}
                  onChange={(names) =>
                    update("skills", g.id, { items: names.map((name) => ({ name })) })
                  }
                  placeholder="React, Next.js, Vue…"
                />
              </FormField>
            </div>
          </EntryCard>
        ))}

        {items.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => add("skills", { ...newSkillGroup(), category: cat })}
                className="rounded-[var(--radius-pill)] border border-line-strong px-3.5 py-1.5 text-[0.8rem] text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                + {cat}
              </button>
            ))}
          </div>
        )}

        <AddEntryButton label="Add skill group" onClick={() => add("skills", newSkillGroup())} />
      </SectionList>
    </div>
  );
}
