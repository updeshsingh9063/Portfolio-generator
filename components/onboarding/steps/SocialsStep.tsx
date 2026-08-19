"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { newSocial } from "@/lib/portfolio/blank";
import { StepIntro, SectionList } from "@/components/onboarding/step-shell";
import { AddEntryButton } from "@/components/onboarding/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Link2, Trash2 } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Social } from "@/lib/portfolio/schema";

const PLATFORMS: { value: Social["platform"]; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "medium", label: "Medium" },
  { value: "kaggle", label: "Kaggle" },
  { value: "leetcode", label: "LeetCode" },
  { value: "stackoverflow", label: "Stack Overflow" },
  { value: "website", label: "Website" },
  { value: "custom", label: "Custom" },
];

export function SocialsStep({ index }: { index: number }) {
  const items = useOnboarding((s) => s.data.socials);
  const add = useOnboarding((s) => s.addEntry);
  const update = useOnboarding((s) => s.updateEntry);
  const remove = useOnboarding((s) => s.removeEntry);

  return (
    <div>
      <StepIntro
        index={index}
        title="Social links"
        subtitle="Where can people find you? Add at least one — these power your header menu and footer."
      />

      <SectionList>
        {items.length === 0 && (
          <EmptyState
            icon={<Link2 />}
            title="No links yet"
            description="Add LinkedIn, GitHub, or any profile you'd like to share."
          />
        )}

        {items.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-1 items-end gap-3 rounded-[var(--radius-lg)] border border-line bg-surface p-4 sm:grid-cols-[10rem_1fr_1fr_auto]"
          >
            <FormField label="Platform">
              <Select value={s.platform} onValueChange={(v) => update("socials", s.id, { platform: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="URL">
              <Input value={s.url} onChange={(e) => update("socials", s.id, { url: e.target.value })} placeholder="https://…" />
            </FormField>
            <FormField label="Display label" hint="Optional">
              <Input value={s.label} onChange={(e) => update("socials", s.id, { label: e.target.value })} placeholder="@yourhandle" />
            </FormField>
            <button
              type="button"
              onClick={() => remove("socials", s.id)}
              aria-label="Remove link"
              className="mb-1 grid size-11 place-items-center rounded-[var(--radius-md)] text-faint transition-colors hover:bg-error/8 hover:text-error"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}

        <AddEntryButton label="Add social link" onClick={() => add("socials", newSocial())} />
      </SectionList>
    </div>
  );
}
