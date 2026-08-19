"use client";

import { useOnboarding } from "@/lib/store/onboarding";
import { EmbeddedContext } from "@/components/onboarding/step-shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import { PersonalStep } from "@/components/onboarding/steps/PersonalStep";
import { ProjectsStep } from "@/components/onboarding/steps/ProjectsStep";
import { ExperienceStep } from "@/components/onboarding/steps/ExperienceStep";
import { EducationStep } from "@/components/onboarding/steps/EducationStep";
import { SkillsStep } from "@/components/onboarding/steps/SkillsStep";
import { CertificationsStep } from "@/components/onboarding/steps/CertificationsStep";
import { AchievementsStep } from "@/components/onboarding/steps/AchievementsStep";
import { SocialsStep } from "@/components/onboarding/steps/SocialsStep";
import { ResumeStep } from "@/components/onboarding/steps/ResumeStep";

export function ContentPanel() {
  const data = useOnboarding((s) => s.data);

  const sections = [
    { id: "personal", label: "Personal", Component: PersonalStep, count: undefined },
    { id: "projects", label: "Projects", Component: ProjectsStep, count: data.projects.length },
    { id: "experience", label: "Experience", Component: ExperienceStep, count: data.experience.length },
    { id: "education", label: "Education", Component: EducationStep, count: data.education.length },
    { id: "skills", label: "Skills", Component: SkillsStep, count: data.skills.length },
    { id: "certifications", label: "Certifications", Component: CertificationsStep, count: data.certifications.length },
    { id: "achievements", label: "Achievements", Component: AchievementsStep, count: data.achievements.length },
    { id: "socials", label: "Social Links", Component: SocialsStep, count: data.socials.length },
    { id: "resume", label: "Résumé", Component: ResumeStep, count: undefined },
  ] as const;

  return (
    <EmbeddedContext.Provider value={true}>
      <Accordion type="single" collapsible defaultValue="personal" className="flex flex-col gap-3">
        {sections.map(({ id, label, Component, count }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger
              badge={
                typeof count === "number" && count > 0 ? (
                  <Badge variant="muted" size="sm">
                    {count}
                  </Badge>
                ) : undefined
              }
            >
              {label}
            </AccordionTrigger>
            <AccordionContent>
              <Component index={0} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </EmbeddedContext.Provider>
  );
}
