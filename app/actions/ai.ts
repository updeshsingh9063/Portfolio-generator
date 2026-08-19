"use server";

import Groq from "groq-sdk";

export type EnhanceKind =
  | "headline"
  | "bio"
  | "about"
  | "project"
  | "experience"
  | "achievement"
  | "seo";

export type EnhanceResult =
  | { ok: true; text: string }
  | { ok: false; reason: "not_configured" | "empty" | "error"; message?: string };

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const GUIDANCE: Record<EnhanceKind, string> = {
  headline: "Rewrite this into a crisp, professional portfolio headline. Max ~8 words. No period.",
  bio: "Rewrite this into a polished 1–2 sentence professional bio, first person, warm but confident.",
  about: "Rewrite this into a refined About paragraph (2–4 sentences), first person, specific and human — not corporate filler.",
  project:
    "Rewrite this into a professional portfolio project description (2–3 sentences): what it is, what was built, and the outcome. Concrete and impactful.",
  experience:
    "Rewrite this into a strong, results-oriented role description (1–2 sentences). Lead with impact.",
  achievement: "Rewrite this into a concise, impressive one-sentence achievement description.",
  seo: "Write a single SEO meta description (~150 chars) for this person's portfolio. Third person, keyword-aware, no quotes.",
};

/**
 * Improve a piece of portfolio copy with Groq (Llama 3.3). Never fabricates
 * facts — it only sharpens what the user wrote. Results are always editable.
 */
export async function enhanceText(kind: EnhanceKind, text: string): Promise<EnhanceResult> {
  const input = text?.trim();
  if (!input) return { ok: false, reason: "empty" };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { ok: false, reason: "not_configured" };

  try {
    const groq = new Groq({ apiKey });
    // `reasoning_effort` is a Groq extension (gpt-oss reasons before answering);
    // keep it low so the token budget goes to the answer, not the scratchpad.
    const params = {
      model: MODEL,
      max_tokens: 800,
      temperature: 0.7,
      reasoning_effort: "low",
      messages: [
        {
          role: "system",
          content:
            "You are an expert portfolio copywriter. Improve the user's text: make it professional, " +
            "clear, and compelling while staying truthful — never invent facts, numbers, employers, or " +
            "technologies that aren't present. Preserve the person's meaning and any specifics. " +
            "Return ONLY the improved text with no preamble, quotes, or explanation.",
        },
        {
          role: "user",
          content: `${GUIDANCE[kind]}\n\nText to improve:\n"""${input}"""`,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completion: any = await groq.chat.completions.create(params);

    const out = String(completion?.choices?.[0]?.message?.content ?? "")
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!out) return { ok: false, reason: "error", message: "Empty response." };
    return { ok: true, text: out };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
