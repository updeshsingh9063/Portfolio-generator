"use client";

import { Check, Circle, Sparkles, Rocket } from "lucide-react";
import { useOnboarding, STEPS, stepComplete } from "@/lib/store/onboarding";
import { StepIntro } from "@/components/onboarding/step-shell";
import { PreviewFrame } from "@/components/onboarding/preview-frame";
import { cn } from "@/lib/utils";

export function ReviewStep({ index }: { index: number }) {
  const data = useOnboarding((s) => s.data);
  const setStep = useOnboarding((s) => s.setStep);

  const checks = STEPS.filter((s) => !["design", "review"].includes(s.id)).map((s, i) => ({
    ...s,
    stepIndex: i,
    done: stepComplete(data, s.id),
  }));

  const requiredDone =
    data.profile.fullName && data.profile.headline && data.profile.email;

  return (
    <div>
      <StepIntro
        index={index}
        title="Preview & finish"
        subtitle="Here's your portfolio, live. Review it, then you'll be ready to publish and claim your URL."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.9fr]">
        {/* checklist */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5">
            <p className="overline mb-4">Your progress</p>
            <ul className="flex flex-col gap-1">
              {checks.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setStep(c.stepIndex)}
                    className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2 text-left transition-colors hover:bg-surface-2"
                  >
                    {c.done ? (
                      <span className="grid size-5 place-items-center rounded-full bg-ink text-on-dark">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    ) : (
                      <Circle className={cn("size-5", c.optional ? "text-line-strong" : "text-accent")} />
                    )}
                    <span className={cn("text-[0.9rem]", c.done ? "text-foreground" : "text-muted")}>
                      {c.label}
                    </span>
                    {c.optional && !c.done && (
                      <span className="ml-auto text-caption text-faint">optional</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-line bg-accent/5 p-5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-accent-deep" />
              <p className="text-[0.9rem] font-medium text-foreground">Polish with AI</p>
            </div>
            <p className="mt-1.5 text-small text-muted">
              In the editor, AI can sharpen your bio, project, and experience descriptions — you
              approve every edit.
            </p>
          </div>

          <div
            className={cn(
              "flex items-start gap-3 rounded-[var(--radius-lg)] border p-5",
              requiredDone ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"
            )}
          >
            <Rocket className={cn("mt-0.5 size-5 shrink-0", requiredDone ? "text-success" : "text-warning")} />
            <div>
              <p className="text-[0.9rem] font-medium text-foreground">
                {requiredDone ? "Ready to publish" : "A few essentials left"}
              </p>
              <p className="mt-1 text-small text-muted">
                {requiredDone
                  ? "Publishing and unique URLs arrive in the next phases — your data is safely autosaved."
                  : "Add your name, headline, and email in the Personal step to be publish-ready."}
              </p>
            </div>
          </div>
        </div>

        {/* live preview */}
        <PreviewFrame src="/create/preview" className="h-[68vh] min-h-[520px]" />
      </div>
    </div>
  );
}
