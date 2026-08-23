"use client";

import * as React from "react";
import { Upload, X, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { uploadImage } from "@/app/actions/upload";

/**
 * Profile photo picker. Uploads the chosen image to storage and stores the
 * resulting public URL (not a base64 data URL) so the photo persists reliably
 * and renders on the published portfolio and dashboard.
 */
export function AvatarUpload({
  value,
  onChange,
  shape = "rounded",
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  shape?: "circle" | "rounded";
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  // Instant local preview while the upload is in flight.
  const [preview, setPreview] = React.useState<string | null>(null);

  const shown = preview ?? value;

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image is too large — please keep it under 8MB.");
      return;
    }

    // Show an immediate local preview.
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "avatars");
      const res = await uploadImage(fd);

      if (res.ok) {
        onChange(res.url);
      } else if (res.reason === "not_configured") {
        toast.error("Image uploads aren't configured", {
          description: "Add Supabase storage credentials to enable photo uploads.",
        });
        setPreview(null);
      } else {
        toast.error("Couldn't upload photo", { description: res.message });
        setPreview(null);
      }
    } catch {
      toast.error("Couldn't upload photo. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  const remove = () => {
    setPreview(null);
    onChange(undefined);
  };

  return (
    <div className="flex items-center gap-5">
      <div
        className={cn(
          "relative grid size-24 place-items-center overflow-hidden border border-line bg-surface-2",
          shape === "circle" ? "rounded-full" : "rounded-[var(--radius-lg)]"
        )}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Profile" className="size-full object-cover" />
        ) : (
          <User className="size-8 text-faint" strokeWidth={1.5} />
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-ink/40 backdrop-blur-[1px]">
            <Loader2 className="size-5 animate-spin text-on-dark" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-line-strong bg-surface px-3.5 py-2 text-[0.82rem] font-medium text-foreground transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-60"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Uploading…" : value ? "Replace" : "Upload photo"}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={remove}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-2 text-[0.82rem] text-faint transition-colors hover:text-error"
            >
              <X className="size-4" /> Remove
            </button>
          )}
        </div>
        <p className="text-caption text-faint">JPG, PNG or WebP · square works best · up to 8MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
