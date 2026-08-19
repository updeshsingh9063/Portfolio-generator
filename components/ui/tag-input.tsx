"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Chip input for string arrays (technologies, coursework, features, …). */
export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const parts = raw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const merged = [...value];
    for (const p of parts) if (!merged.includes(p)) merged.push(p);
    onChange(merged);
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] border border-line bg-surface px-2 py-1.5",
        "transition-colors focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/12",
        ariaInvalid && "border-error ring-error/12"
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-surface-2 py-1 pl-2.5 pr-1 text-[0.8rem] text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="grid size-4 place-items-center rounded-full text-faint transition-colors hover:bg-line hover:text-foreground"
            aria-label={`Remove ${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
        placeholder={value.length ? "" : placeholder}
        className="h-8 min-w-[8rem] flex-1 bg-transparent px-1.5 text-[0.9rem] text-foreground placeholder:text-faint focus:outline-none"
      />
    </div>
  );
}
