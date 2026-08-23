"use server";

import Groq from "groq-sdk";
import { auth } from "@/auth";
import { extractedResumeSchema, type ExtractedResume } from "@/lib/portfolio/resume-extract";

export type ParseResumeResult =
  | { ok: true; data: ExtractedResume }
  | {
      ok: false;
      reason: "unauthorized" | "not_configured" | "invalid" | "no_text" | "error";
      message?: string;
    };

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_TEXT = 24_000; // chars of résumé text sent to the model
const NBSP = / /g;

/* ------------------------------ text extraction --------------------------- */

async function extractPdf(bytes: Buffer): Promise<string> {
  // pdf-parse v2 exposes a PDFParse class (pdf.js under the hood).
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(bytes) });
  try {
    const out = await parser.getText();
    return out.text ?? "";
  } finally {
    await parser.destroy();
  }
}

async function extractDocx(bytes: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const out = await mammoth.extractRawText({ buffer: bytes });
  return out.value ?? "";
}

async function extractText(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const type = file.type;

  if (type === "application/pdf" || name.endsWith(".pdf")) return extractPdf(bytes);
  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return extractDocx(bytes);
  }
  throw new Error("Unsupported file type. Upload a PDF or DOCX résumé.");
}

/* ------------------------------ LLM extraction ---------------------------- */

const SYSTEM = `You are a precise résumé parser. Given the raw text of a résumé, extract a structured JSON object.
Rules:
- Return ONLY a JSON object — no markdown, no commentary.
- NEVER invent facts. Omit anything not present in the text. Leave unknown fields out or empty.
- Copy wording faithfully; lightly clean formatting artifacts only.
- Dates: keep human-readable as written (e.g. "Jul 2026", "2025", "Present").
- responsibilities: split each role's bullet points into separate strings.
- skills: group by the résumé's own categories when present; otherwise a single "Skills" group. items is a flat string array.
- socials: platform is one of linkedin, github, twitter, instagram, youtube, behance, dribbble, medium, kaggle, leetcode, stackoverflow, website, email — else "custom". url is the full link.
- profile.headline is the person's role/title line. profile.about is a longer summary paragraph; profile.bio is a 1–2 sentence short version (may reuse the summary).`;

const JSON_SHAPE = `{
  "profile": { "fullName": "", "headline": "", "email": "", "phone": "", "location": "", "website": "", "bio": "", "about": "" },
  "experience": [ { "company": "", "title": "", "employmentType": "", "location": "", "startDate": "", "endDate": "", "current": false, "responsibilities": [], "technologies": [] } ],
  "education": [ { "institution": "", "degree": "", "field": "", "startYear": "", "endYear": "", "grade": "" } ],
  "projects": [ { "name": "", "category": "", "description": "", "technologies": [], "liveUrl": "", "githubUrl": "" } ],
  "skills": [ { "category": "", "items": [] } ],
  "certifications": [ { "name": "", "issuer": "", "issueDate": "" } ],
  "achievements": [ { "title": "", "description": "", "organization": "", "date": "" } ],
  "socials": [ { "platform": "", "label": "", "url": "" } ]
}`;

/**
 * Parse an uploaded résumé (PDF/DOCX) into structured portfolio data using
 * text extraction + Groq. Never fabricates — only extracts what's present.
 * The result is reviewed by the user before it fills the form.
 */
export async function parseResume(formData: FormData): Promise<ParseResumeResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "unauthorized", message: "Please sign in." };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { ok: false, reason: "not_configured" };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, reason: "invalid", message: "No file provided." };
  if (file.size > MAX_BYTES) return { ok: false, reason: "invalid", message: "File is too large — keep it under 8MB." };

  let text: string;
  try {
    text = (await extractText(file))
      .replace(NBSP, " ") // non-breaking spaces → normal spaces
      .replace(/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/gim, "") // pdf-parse page markers
      .replace(/[ \t]+\n/g, "\n") // trailing whitespace per line
      .replace(/\n{3,}/g, "\n\n") // collapse blank-line runs
      .trim();
  } catch (err) {
    return { ok: false, reason: "invalid", message: err instanceof Error ? err.message : "Couldn't read that file." };
  }

  if (text.length < 30) {
    return {
      ok: false,
      reason: "no_text",
      message: "Couldn't find selectable text — this may be a scanned image. Try a text-based PDF.",
    };
  }
  if (text.length > MAX_TEXT) text = text.slice(0, MAX_TEXT);

  try {
    const groq = new Groq({ apiKey });
    const params = {
      model: MODEL,
      max_tokens: 4096,
      temperature: 0.2,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Extract into exactly this JSON shape (fill what applies, omit the rest):\n${JSON_SHAPE}\n\nRÉSUMÉ TEXT:\n"""${text}"""`,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completion: any = await groq.chat.completions.create(params);
    const raw = String(completion?.choices?.[0]?.message?.content ?? "").trim();
    if (!raw) return { ok: false, reason: "error", message: "The parser returned nothing. Try again." };

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      // Salvage a JSON object if the model wrapped it in prose/fences.
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) return { ok: false, reason: "error", message: "Could not parse the résumé. Try again." };
      json = JSON.parse(match[0]);
    }

    const parsed = extractedResumeSchema.safeParse(json);
    if (!parsed.success) return { ok: false, reason: "error", message: "Extracted data didn't match the expected shape." };

    return { ok: true, data: parsed.data };
  } catch (err) {
    return { ok: false, reason: "error", message: err instanceof Error ? err.message : "Extraction failed." };
  }
}
