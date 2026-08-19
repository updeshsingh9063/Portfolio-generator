"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { newCertification } from "@/lib/portfolio/blank";
import { StepIntro, FieldGrid, SectionList } from "@/components/onboarding/step-shell";
import { EntryCard, AddEntryButton } from "@/components/onboarding/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { BadgeCheck } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function CertificationsStep({ index }: { index: number }) {
  const items = useOnboarding((s) => s.data.certifications);
  const add = useOnboarding((s) => s.addEntry);
  const update = useOnboarding((s) => s.updateEntry);
  const remove = useOnboarding((s) => s.removeEntry);

  return (
    <div>
      <StepIntro
        index={index}
        title="Certifications"
        subtitle="Courses and credentials that back up your skills."
        optional
      />

      <SectionList>
        {items.length === 0 && (
          <EmptyState
            icon={<BadgeCheck />}
            title="No certifications yet"
            description="Add a credential — or skip this step."
          />
        )}

        {items.map((c, i) => (
          <EntryCard
            key={c.id}
            index={i}
            title={c.name || `Certification ${String(i + 1).padStart(2, "0")}`}
            onRemove={() => remove("certifications", c.id)}
          >
            <FieldGrid>
              <FormField label="Certification name">
                <Input value={c.name} onChange={(e) => update("certifications", c.id, { name: e.target.value })} placeholder="Interaction Design Specialization" />
              </FormField>
              <FormField label="Issuing organization">
                <Input value={c.issuer} onChange={(e) => update("certifications", c.id, { issuer: e.target.value })} placeholder="UC San Diego" />
              </FormField>
              <FormField label="Issue date">
                <Input value={c.issueDate} onChange={(e) => update("certifications", c.id, { issueDate: e.target.value })} placeholder="2020" />
              </FormField>
              <FormField label="Credential ID">
                <Input value={c.credentialId} onChange={(e) => update("certifications", c.id, { credentialId: e.target.value })} placeholder="IDX-2291" />
              </FormField>
              <FormField label="Credential URL" className="sm:col-span-2">
                <Input value={c.credentialUrl ?? ""} onChange={(e) => update("certifications", c.id, { credentialUrl: e.target.value })} placeholder="https://…" />
              </FormField>
            </FieldGrid>
          </EntryCard>
        ))}

        <AddEntryButton label="Add certification" onClick={() => add("certifications", newCertification())} />
      </SectionList>
    </div>
  );
}
