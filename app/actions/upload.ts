"use server";

import { auth } from "@/auth";
import { STORAGE_BUCKET, supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not_configured" | "unauthorized" | "invalid" | "error"; message?: string };

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

let bucketReady = false;

/** Ensure the public assets bucket exists (idempotent, cached per server process). */
async function ensureBucket(admin: ReturnType<typeof supabaseAdmin>) {
  if (bucketReady) return;
  const { data } = await admin.storage.getBucket(STORAGE_BUCKET);
  if (!data) {
    await admin.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
    });
  }
  bucketReady = true;
}

/**
 * Upload an image to Supabase Storage and return its public URL. Used for
 * profile photos and project images so portfolios store a real URL rather than
 * a giant base64 data URL (which bloats the draft and never persists reliably).
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthorized", message: "Please sign in." };

  if (!supabaseConfigured) return { ok: false, reason: "not_configured" };

  const file = formData.get("file");
  const folderRaw = formData.get("folder");
  const folder = typeof folderRaw === "string" && /^[a-z0-9_-]+$/.test(folderRaw) ? folderRaw : "uploads";

  if (!(file instanceof File)) return { ok: false, reason: "invalid", message: "No file provided." };
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) return { ok: false, reason: "invalid", message: "Please choose a JPG, PNG, WebP, GIF, or AVIF image." };
  if (file.size > MAX_BYTES) return { ok: false, reason: "invalid", message: "Image is too large — keep it under 8MB." };

  try {
    const admin = supabaseAdmin();
    await ensureBucket(admin);

    const path = `${folder}/${session.user.id}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error } = await admin.storage.from(STORAGE_BUCKET).upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) return { ok: false, reason: "error", message: error.message };

    const { data } = admin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    if (!data?.publicUrl) return { ok: false, reason: "error", message: "Could not resolve public URL." };

    return { ok: true, url: data.publicUrl };
  } catch (err) {
    return { ok: false, reason: "error", message: err instanceof Error ? err.message : "Upload failed." };
  }
}
