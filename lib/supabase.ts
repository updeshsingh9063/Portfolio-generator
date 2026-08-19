import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const STORAGE_BUCKET = "portfolio-assets";

export const supabaseConfigured = Boolean(url && serviceKey);

/**
 * Server-side Supabase client using the service role key — used for signed
 * uploads to storage. Never import this into client components.
 */
export function supabaseAdmin() {
  if (!url || !serviceKey) {
    throw new Error("Supabase is not configured (missing URL or service role key).");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
