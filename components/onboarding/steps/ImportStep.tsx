"use client";

import * as React from "react";
import { Upload, FileText, Sparkles, Loader2, X, RefreshCw, Wand2 } from "lucide-react";
import { useOnboarding } from "@/lib/store/onboarding";
import { parseResume } from "@/app/actions/resume";
import {
  importCounts,
  IMPORT_SECTIONS,
  type ExtractedResume,
  type ImportSection,
} from "@/lib/portfolio/resume-extract";
import { StepIntro } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";

const SECTION_LABELS: Record<ImportSection, string> = {
  profile: "Profile & contact",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  socials: "Social links",
};

const unit = (section: ImportSection, n: number) => {
  const noun =
    section === "profile" ? "detail" : section === "skills" ? "group" : "entry";
  const plural = noun === "entry" ? "entries" : `${noun}s`;
  return `${n} ${n === 1 ? noun : plural}`;
};

type Phase = "idle" | "parsing" | "review";

export function ImportStep({ index }: { index: number }) {
  const importData = useOnboarding((s) => s.importData);
  const next = useOnboarding((s) => s.next);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [phase, setPhase] = React.useState<Phase>("idle");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [extracted, setExtracted] = React.useState<ExtractedResume | null>(null);
  const [selected, setSelected] = React.useState<Record<ImportSection, boolean>>(
    () => Object.fromEntries(IMPORT_SECTIONS.map((s) => [s, true])) as Record<ImportSection, boolean>
  );

  const counts = extracted ? importCounts(extracted) : null;
  const available = counts ? IMPORT_SECTIONS.filter((s) => counts[s] > 0) : [];
  const chosenCount = available.filter((s) => selected[s]).length;

  const onFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setPhase("parsing");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await parseResume(fd);
      if (res.ok) {
        const c = importCounts(res.data);
        const anything = IMPORT_SECTIONS.some((s) => c[s] > 0);
        if (!anything) {
          toast.error("Nothing to import", { description: "We couldn't find structured details in that résumé." });
          setPhase("idle");
          return;
        }
        setExtracted(res.data);
        setSelected(Object.fromEntries(IMPORT_SECTIONS.map((s) => [s, c[s] > 0])) as Record<ImportSection, boolean>);
        setPhase("review");
        toast.success("Résumé read", { description: "Review what we found, then fill your form." });
      } else {
        const msg =
          res.reason === "not_configured"
            ? "AI import isn't configured on this environment."
            : res.message ?? "Couldn't read that résumé.";
        toast.error("Import failed", { description: msg });
        setPhase("idle");
      }
    } catch {
      toast.error("Import failed", { description: "Something went wrong. Please try again." });
      setPhase("idle");
    }
  };

  const apply = () => {
    if (!extracted) return;
    const sections = available.filter((s) => selected[s]);
    if (sections.length === 0) {
      toast.error("Nothing selected", { description: "Pick at least one section, or skip this step." });
      return;
    }
    importData(extracted, sections);
    toast.success("Added to your form", { description: "Review and refine everything in the next steps." });
    next();
  };

  const reset = () => {
    setExtracted(null);
    setFileName(null);
    setPhase("idle");
  };

  return (
    <div>
      <StepIntro
        index={index}
        title="Start with your résumé"
        subtitle="Upload a PDF or Word résumé and we'll extract your experience, projects, and skills to pre-fill the form. You'll review everything before it's added — and you can always skip and fill it in yourself."
        optional
      />

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {phase !== "review" && (
        <div className="flex flex-col gap-6">
          <button
            type="button"
            disabled={phase === "parsing"}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface/60 px-6 py-14 text-center transition-colors hover:border-accent hover:bg-surface disabled:pointer-events-none disabled:opacity-70"
          >
            <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-accent-deep">
              {phase === "parsing" ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            </span>
            <span className="text-[0.95rem] font-medium text-foreground">
              {phase === "parsing" ? `Reading ${fileName ?? "résumé"}…` : "Upload your résumé"}
            </span>
            <span className="text-caption text-faint">PDF or DOCX · up to 8MB</span>
          </button>

          <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-accent/5 p-5">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-accent-deep" />
            <div>
              <p className="text-[0.9rem] font-medium text-foreground">AI-assisted, never automatic</p>
              <p className="mt-1 text-small text-muted">
                We only extract what's written in your résumé — nothing is invented. You choose what gets added
                and edit it all in the next steps.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button variant="ghost" onClick={next} disabled={phase === "parsing"}>
              Skip — I&apos;ll fill it in manually
            </Button>
          </div>
        </div>
      )}

      {phase === "review" && extracted && counts && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="size-5 shrink-0 text-accent-deep" />
              <span className="truncate text-small font-medium">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-caption text-faint transition-colors hover:text-foreground"
            >
              <RefreshCw className="size-3.5" /> Use a different file
            </button>
          </div>

          <div>
            <p className="mb-1 text-[0.9rem] font-medium text-foreground">Here&apos;s what we found</p>
            <p className="mb-4 text-small text-muted">
              Choose what to add. Empty fields get filled; anything you&apos;ve already entered is kept.
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {available.map((section) => (
                <label
                  key={section}
                  className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 transition-colors hover:bg-surface-2"
                >
                  <Checkbox
                    checked={selected[section]}
                    onCheckedChange={(v) => setSelected((prev) => ({ ...prev, [section]: Boolean(v) }))}
                  />
                  <span className="flex-1">
                    <span className="block text-[0.9rem] font-medium text-foreground">
                      {SECTION_LABELS[section]}
                    </span>
                    <span className="block text-caption text-faint">{unit(section, counts[section])}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <Button variant="ghost" onClick={next}>
              Skip
            </Button>
            <Button variant="accent" onClick={apply} disabled={chosenCount === 0}>
              <Wand2 className="size-4" /> Add {chosenCount > 0 ? `${chosenCount} ` : ""}
              {chosenCount === 1 ? "section" : "sections"} & continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
