/** Routes that can never be usernames (they're real app paths or sensitive). */
export const RESERVED_SLUGS = new Set([
  "api", "app", "www", "admin", "administrator", "root", "system",
  "login", "signup", "signin", "signout", "logout", "auth", "register",
  "dashboard", "editor", "create", "preview", "styleguide", "settings",
  "account", "billing", "pricing", "plans", "upgrade", "checkout",
  "about", "help", "support", "contact", "docs", "blog", "changelog",
  "terms", "privacy", "legal", "cookies", "security",
  "explore", "templates", "discover", "search", "new", "edit", "me",
  "home", "index", "public", "static", "assets", "images", "img", "favicon",
  "sitemap", "robots", "manifest", "og", "cdn", "status", "health",
  "folio", "portfolio", "portfolios", "user", "users", "profile", "profiles",
]);

/** A small, conservative offensive-word blocklist (substring match). */
const BLOCKED_SUBSTRINGS = [
  "fuck", "shit", "cunt", "nigger", "faggot", "bitch", "asshole", "rape",
  "porn", "nsfw", "sex", "nazi", "slut", "whore",
];

export type UsernameError =
  | "too_short"
  | "too_long"
  | "invalid_chars"
  | "edge_hyphen"
  | "double_hyphen"
  | "reserved"
  | "blocked";

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;

/** Normalize a display name into a candidate slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, USERNAME_MAX);
}

/** Validate a username's *format* (availability is checked separately). */
export function validateUsername(raw: string): { ok: true } | { ok: false; error: UsernameError } {
  const u = raw.toLowerCase();
  if (u.length < USERNAME_MIN) return { ok: false, error: "too_short" };
  if (u.length > USERNAME_MAX) return { ok: false, error: "too_long" };
  if (!/^[a-z0-9-]+$/.test(u)) return { ok: false, error: "invalid_chars" };
  if (u.startsWith("-") || u.endsWith("-")) return { ok: false, error: "edge_hyphen" };
  if (u.includes("--")) return { ok: false, error: "double_hyphen" };
  if (RESERVED_SLUGS.has(u)) return { ok: false, error: "reserved" };
  if (BLOCKED_SUBSTRINGS.some((w) => u.includes(w))) return { ok: false, error: "blocked" };
  return { ok: true };
}

export const USERNAME_ERROR_MESSAGES: Record<UsernameError, string> = {
  too_short: `Use at least ${USERNAME_MIN} characters.`,
  too_long: `Keep it under ${USERNAME_MAX} characters.`,
  invalid_chars: "Only lowercase letters, numbers, and hyphens.",
  edge_hyphen: "Can't start or end with a hyphen.",
  double_hyphen: "No double hyphens.",
  reserved: "That name is reserved.",
  blocked: "That name isn't allowed.",
};

/** Generate candidate alternatives for a base slug (before availability check). */
export function suggestUsernames(base: string, year = 2026): string[] {
  const b = slugify(base) || "portfolio";
  const trimmed = b.slice(0, USERNAME_MAX - 5);
  const candidates = [
    `${trimmed}-dev`,
    `${trimmed}${year}`,
    `${trimmed}-io`,
    `${trimmed}-co`,
    `hey-${trimmed}`,
    `${trimmed}-1`,
  ];
  return candidates
    .map((c) => c.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, ""))
    .filter((c) => validateUsername(c).ok);
}
