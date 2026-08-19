"use client";

import * as React from "react";
import { Upload, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

/**
 * Profile photo picker. Reads a chosen file into a data URL for the draft
 * (persisted to real storage on publish, in the storage phase).
 */
export function AvatarUpload({
  value,
  onChange,
  shape = "rounded",
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  shape?: "circle" | "rounded";
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image is too large — please keep it under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-5">
      <div
        className={cn(
          "relative grid size-24 place-items-center overflow-hidden border border-line bg-surface-2",
          shape === "circle" ? "rounded-full" : "rounded-[var(--radius-lg)]"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Profile" className="size-full object-cover" />
        ) : (
          <User className="size-8 text-faint" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-line-strong bg-surface px-3.5 py-2 text-[0.82rem] font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            <Upload className="size-4" /> {value ? "Replace" : "Upload photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-2 text-[0.82rem] text-faint transition-colors hover:text-error"
            >
              <X className="size-4" /> Remove
            </button>
          )}
        </div>
        <p className="text-caption text-faint">JPG, PNG or WebP · square works best · up to 4MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}
