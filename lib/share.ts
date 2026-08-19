export interface ShareLink {
  id: string;
  label: string;
  href: string;
}

/** One-click share targets for a portfolio URL. */
export function buildShareLinks(url: string, title: string): ShareLink[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { id: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { id: "twitter", label: "X / Twitter", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { id: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: "email", label: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];
}
