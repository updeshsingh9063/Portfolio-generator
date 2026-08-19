"use client";

import { Check, Lock } from "lucide-react";
import { useOnboarding } from "@/lib/store/onboarding";
import { StepIntro } from "@/components/onboarding/step-shell";
import { listTemplates } from "@/components/portfolio/registry";
import { ACCENT_PRESETS } from "@/lib/portfolio/theme";
import { cn } from "@/lib/utils";

const COMING_SOON = [
  { id: "monochrome", name: "Monochrome", bestFor: "Developers · Engineers" },
  { id: "aurora", name: "Aurora", bestFor: "AI / ML · Data" },
  { id: "ledger", name: "Ledger", bestFor: "Corporate · Executive" },
];

export function DesignStep({ index }: { index: number }) {
  const settings = useOnboarding((s) => s.data.settings);
  const patch = useOnboarding((s) => s.patchSettings);
  const templates = listTemplates();

  return (
    <div>
      <StepIntro
        index={index}
        title="Choose your look"
        subtitle="Pick a template and an accent. You can fine-tune fonts, dark mode, and section order in the editor."
      />

      <p className="overline mb-4">Template</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => {
          const active = settings.templateId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => patch({ templateId: t.id })}
              className={cn(
                "group relative overflow-hidden rounded-[var(--radius-lg)] border p-1 text-left transition-all",
                active ? "border-accent ring-4 ring-accent/12" : "border-line hover:border-foreground/25"
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-paper">
                {/* editorial mini-mock */}
                <div className="absolute inset-0 grain" />
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-widest text-faint">
                    <span>Menu</span>
                    <span>2026</span>
                  </div>
                  <div className="font-display text-3xl font-medium leading-none text-foreground">
                    Portfolio
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-8 flex-1 rounded-sm bg-ink/90" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-3">
                <div>
                  <p className="text-[0.9rem] font-medium text-foreground">{t.name}</p>
                  <p className="text-caption text-faint">{t.bestFor}</p>
                </div>
                {active && (
                  <span className="grid size-6 place-items-center rounded-full bg-accent text-white">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {COMING_SOON.map((t) => (
          <div
            key={t.id}
            className="relative overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-line p-1 opacity-70"
          >
            <div className="relative grid aspect-[4/3] place-items-center rounded-[var(--radius-md)] bg-surface-2">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-paper px-3 py-1 text-caption text-faint">
                <Lock className="size-3" /> Coming soon
              </span>
            </div>
            <div className="px-3 py-3">
              <p className="text-[0.9rem] font-medium text-muted">{t.name}</p>
              <p className="text-caption text-faint">{t.bestFor}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="overline mb-4 mt-10">Accent</p>
      <div className="flex flex-wrap gap-3">
        {ACCENT_PRESETS.map((a) => {
          const active = (settings.accent ?? "bronze") === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => patch({ accent: a.id })}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-pill)] border py-2 pl-2 pr-4 transition-all",
                active ? "border-foreground/30 bg-surface" : "border-line hover:border-foreground/20"
              )}
            >
              <span className="size-7 rounded-full border border-black/5" style={{ background: a.accent }} />
              <span className="text-[0.85rem] font-medium">{a.name}</span>
              {active && <Check className="size-3.5 text-accent-deep" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
