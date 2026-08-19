"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { newProject } from "@/lib/portfolio/blank";
import { StepIntro, FieldGrid, SectionList } from "@/components/onboarding/step-shell";
import { EntryCard, AddEntryButton } from "@/components/onboarding/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderGit2, Github, Globe } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { AIEnhance } from "@/components/ai/enhance";

export function ProjectsStep({ index }: { index: number }) {
  const items = useOnboarding((s) => s.data.projects);
  const add = useOnboarding((s) => s.addEntry);
  const update = useOnboarding((s) => s.updateEntry);
  const remove = useOnboarding((s) => s.removeEntry);

  return (
    <div>
      <StepIntro
        index={index}
        title="Projects"
        subtitle="Your best work — the heart of your portfolio. Add as many as you like; feature the ones you're proudest of."
      />

      <SectionList>
        {items.length === 0 && (
          <EmptyState
            icon={<FolderGit2 />}
            title="No projects yet"
            description="Add your first project to bring your portfolio to life."
          />
        )}

        {items.map((p, i) => (
          <EntryCard
            key={p.id}
            index={i}
            title={p.name || `Project ${String(i + 1).padStart(2, "0")}`}
            onRemove={() => remove("projects", p.id)}
          >
            <FieldGrid>
              <FormField label="Project name">
                <Input value={p.name} onChange={(e) => update("projects", p.id, { name: e.target.value })} placeholder="Velure" />
              </FormField>
              <FormField label="Category">
                <Input value={p.category} onChange={(e) => update("projects", p.id, { category: e.target.value })} placeholder="Fashion Brand · Web Design" />
              </FormField>
              <FormField label="Your role">
                <Input value={p.role} onChange={(e) => update("projects", p.id, { role: e.target.value })} placeholder="Art Direction · UI Design" />
              </FormField>
              <FormField label="Image URL" hint="Paste a link, or upload later.">
                <Input value={p.image} onChange={(e) => update("projects", p.id, { image: e.target.value })} placeholder="https://…" />
              </FormField>
              <FormField label="Live demo URL">
                <Input value={p.liveUrl ?? ""} onChange={(e) => update("projects", p.id, { liveUrl: e.target.value })} placeholder="https://…" startIcon={<Globe />} />
              </FormField>
              <FormField label="GitHub URL">
                <Input value={p.githubUrl ?? ""} onChange={(e) => update("projects", p.id, { githubUrl: e.target.value })} placeholder="https://github.com/…" startIcon={<Github />} />
              </FormField>
            </FieldGrid>
            <div className="mt-5 grid grid-cols-1 gap-5">
              <FormField
                label="Description"
                action={
                  <AIEnhance
                    kind="project"
                    value={p.description ?? ""}
                    onAccept={(t) => update("projects", p.id, { description: t })}
                  />
                }
              >
                <Textarea value={p.description} onChange={(e) => update("projects", p.id, { description: e.target.value })} placeholder="What the project is, what you built, and the outcome." />
              </FormField>
              <FormField label="Tech stack">
                <TagInput value={p.technologies} onChange={(v) => update("projects", p.id, { technologies: v })} placeholder="React, Node, Figma…" />
              </FormField>
              <FormField label="Key features">
                <TagInput value={p.features} onChange={(v) => update("projects", p.id, { features: v })} placeholder="Headless commerce, motion system…" />
              </FormField>
            </div>
          </EntryCard>
        ))}

        <AddEntryButton label="Add project" onClick={() => add("projects", newProject())} />
      </SectionList>
    </div>
  );
}
