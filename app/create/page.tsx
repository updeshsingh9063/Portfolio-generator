"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Check, Cloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboarding, STEPS, stepComplete } from "@/lib/store/onboarding";
import { useHydrated } from "@/lib/use-hydrated";
import { Wordmark } from "@/components/ui/navigation";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loading-state";
import { toast } from "@/components/ui/toast";

import { ImportStep } from "@/components/onboarding/steps/ImportStep";
import { PersonalStep } from "@/components/onboarding/steps/PersonalStep";
import { EducationStep } from "@/components/onboarding/steps/EducationStep";
import { ExperienceStep } from "@/components/onboarding/steps/ExperienceStep";
import { ProjectsStep } from "@/components/onboarding/steps/ProjectsStep";
import { SkillsStep } from "@/components/onboarding/steps/SkillsStep";
import { CertificationsStep } from "@/components/onboarding/steps/CertificationsStep";
import { AchievementsStep } from "@/components/onboarding/steps/AchievementsStep";
import { SocialsStep } from "@/components/onboarding/steps/SocialsStep";
import { ResumeStep } from "@/components/onboarding/steps/ResumeStep";
import { DesignStep } from "@/components/onboarding/steps/DesignStep";
import { ReviewStep } from "@/components/onboarding/steps/ReviewStep";

const STEP_COMPONENTS: Record<string, (p: { index: number }) => React.ReactNode> = {
  import: ImportStep,
  personal: PersonalStep,
  education: EducationStep,
  experience: ExperienceStep,
  projects: ProjectsStep,
  skills: SkillsStep,
  certifications: CertificationsStep,
  achievements: AchievementsStep,
  socials: SocialsStep,
  resume: ResumeStep,
  design: DesignStep,
  review: ReviewStep,
};

function SavedBadge() {
  const lastSavedAt = useOnboarding((s) => s.lastSavedAt);
  return (
    <div className="inline-flex items-center gap-2 text-caption text-faint">
      {lastSavedAt ? (
        <>
          <Check className="size-3.5 text-success" /> All changes saved
        </>
      ) : (
        <>
          <Cloud className="size-3.5" /> Autosave on
        </>
      )}
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const step = useOnboarding((s) => s.step);
  const setStep = useOnboarding((s) => s.setStep);
  const next = useOnboarding((s) => s.next);
  const back = useOnboarding((s) => s.back);
  const data = useOnboarding((s) => s.data);
  const mainRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <Spinner label="Loading your draft…" />
      </div>
    );
  }

  const current = STEPS[step];
  const StepComponent = STEP_COMPONENTS[current.id];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const tryNext = () => {
    if (current.id === "personal") {
      const { fullName, headline, email } = data.profile;
      if (!fullName || !headline || !email) {
        toast.error("A few essentials first", {
          description: "Add your name, headline, and email to continue.",
        });
        return;
      }
    }
    next();
  };

  const finish = () => {
    toast.success("Opening your editor", {
      description: "Fine-tune everything with a live preview. Everything's saved.",
    });
    router.push("/editor");
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      {/* Sidebar rail (desktop) */}
      <aside className="hidden w-[300px] shrink-0 flex-col border-r border-line bg-surface/60 lg:flex">
        <div className="flex h-full flex-col p-8">
          <Wordmark />
          <p className="mt-1 text-caption text-faint">Portfolio builder</p>

          <div className="mt-10 flex-1">
            <StepIndicator
              steps={STEPS.map((s) => ({ id: s.id, label: s.label }))}
              current={step}
              onStepClick={setStep}
            />
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <SavedBadge />
            <Link
              href="/"
              className="mt-2 block text-caption text-faint transition-colors hover:text-foreground"
            >
              Save & continue later
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Wordmark />
            <SavedBadge />
          </div>
          <StepIndicator
            steps={STEPS.map((s) => ({ id: s.id, label: s.label }))}
            current={step}
            orientation="horizontal"
          />
          <p className="mt-2 text-caption text-faint">
            Step {String(step + 1).padStart(2, "0")} of {STEPS.length} · {current.label}
          </p>
        </div>

        {/* Step content (scroll area) */}
        <div ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-10 lg:py-16">
            {StepComponent && <StepComponent index={step} />}
          </div>
        </div>

        {/* Footer nav */}
        <div className="sticky bottom-0 z-20 border-t border-line bg-paper/90 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-6 py-4 sm:px-10">
            <Button variant="ghost" onClick={back} disabled={isFirst}>
              <ArrowLeft className="size-4" /> Back
            </Button>

            <div className="flex items-center gap-2.5">
              {current.optional && !isLast && !stepComplete(data, current.id) && (
                <Button variant="subtle" onClick={next}>
                  Skip
                </Button>
              )}
              {isLast ? (
                <Button variant="accent" onClick={finish}>
                  <Check className="size-4" /> Finish
                </Button>
              ) : (
                <Button variant="primary" onClick={tryNext}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
