"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/lib/store/onboarding";
import { listTemplates } from "@/components/portfolio/registry";
import { ACCENT_PRESETS, FONT_PRESETS } from "@/lib/portfolio/theme";

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; note?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-[var(--radius-md)] border border-line bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "flex flex-col items-center rounded-[var(--radius-sm)] px-2 py-2 text-center transition-colors",
            value === o.id ? "bg-ink text-on-dark" : "text-muted hover:bg-surface-2 hover:text-foreground"
          )}
        >
          <span className="text-[0.82rem] font-medium">{o.label}</span>
          {o.note && (
            <span className={cn("text-[0.64rem]", value === o.id ? "text-on-dark-muted" : "text-faint")}>
              {o.note}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="overline mb-3">{label}</p>
      {children}
    </div>
  );
}

export function DesignPanel() {
  const settings = useOnboarding((s) => s.data.settings);
  const patch = useOnboarding((s) => s.patchSettings);
  const templates = listTemplates();

  return (
    <div className="flex flex-col gap-8">
      <Group label="Template">
        <div className="flex flex-col gap-2">
          {templates.map((t) => {
            const active = settings.templateId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => patch({ templateId: t.id })}
                className={cn(
                  "flex items-center justify-between rounded-[var(--radius-md)] border px-4 py-3 text-left transition-all",
                  active ? "border-accent ring-4 ring-accent/12" : "border-line hover:border-foreground/25"
                )}
              >
                <div>
                  <p className="text-[0.9rem] font-medium text-foreground">{t.name}</p>
                  <p className="text-caption text-faint">{t.bestFor}</p>
                </div>
                {active && (
                  <span className="grid size-5 place-items-center rounded-full bg-accent text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Group>

      <Group label="Accent">
        <div className="grid grid-cols-3 gap-2">
          {ACCENT_PRESETS.map((a) => {
            const active = (settings.accent ?? "bronze") === a.id;
            return (
              <button
                key={a.id}
                onClick={() => patch({ accent: a.id })}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-md)] border px-2.5 py-2 transition-all",
                  active ? "border-foreground/30 bg-surface" : "border-line hover:border-foreground/20"
                )}
              >
                <span className="size-5 rounded-full border border-black/5" style={{ background: a.accent }} />
                <span className="truncate text-[0.78rem] font-medium">{a.name}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group label="Display font">
        <Segmented
          options={FONT_PRESETS.map((f) => ({ id: f.id, label: f.name, note: f.note }))}
          value={settings.fontPreset}
          onChange={(v) => patch({ fontPreset: v })}
        />
      </Group>

      <Group label="Motion">
        <Segmented
          options={[
            { id: "none", label: "None" },
            { id: "subtle", label: "Subtle" },
            { id: "expressive", label: "Expressive" },
          ]}
          value={settings.animationIntensity}
          onChange={(v) => patch({ animationIntensity: v })}
        />
        <p className="mt-2 text-caption text-faint">
          Controls scroll-in animations. Always respects reduced-motion settings.
        </p>
      </Group>
    </div>
  );
}
