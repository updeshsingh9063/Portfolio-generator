"use client";

import * as React from "react";
import { FileText, Upload, Sparkles, X } from "lucide-react";
import { useOnboarding } from "@/lib/store/onboarding";
import { StepIntro } from "@/components/onboarding/step-shell";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export function ResumeStep({ index }: { index: number }) {
  const resumeUrl = useOnboarding((s) => s.data.profile.resumeUrl);
  const patch = useOnboarding((s) => s.patchProfile);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div>
      <StepIntro
        index={index}
        title="Résumé"
        subtitle="Attach a résumé so visitors can download it — and, soon, let AI pre-fill your portfolio from it."
        optional
      />

      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface/60 px-6 py-12 text-center transition-colors hover:border-accent hover:bg-surface"
        >
          <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-accent-deep">
            <Upload className="size-5" />
          </span>
          <span className="text-[0.95rem] font-medium text-foreground">
            {fileName ? fileName : "Upload your résumé"}
          </span>
          <span className="text-caption text-faint">PDF or DOCX · up to 8MB</span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFileName(f.name);
                toast.success("Résumé attached", { description: "It'll upload securely when you publish." });
              }
            }}
          />
        </button>

        {fileName && (
          <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-accent-deep" />
              <span className="text-small font-medium">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={() => setFileName(null)}
              className="grid size-8 place-items-center rounded-full text-faint hover:text-error"
              aria-label="Remove résumé"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <FormField label="Or paste a link to your résumé" hint="Google Drive, Dropbox, or a hosted PDF.">
          <Input
            value={resumeUrl ?? ""}
            onChange={(e) => patch({ resumeUrl: e.target.value })}
            placeholder="https://…"
          />
        </FormField>

        <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-accent/5 p-5">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-accent-deep" />
          <div>
            <p className="text-[0.9rem] font-medium text-foreground">AI résumé import</p>
            <p className="mt-1 text-small text-muted">
              Auto-extracting your experience, projects, and skills from an uploaded résumé is coming
              in the AI phase — you'll always review everything before it's published.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
