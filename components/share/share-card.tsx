"use client";

import * as React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, ExternalLink, Linkedin, Twitter, Facebook, Mail, MessageCircle } from "lucide-react";
import { buildShareLinks } from "@/lib/share";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="size-4" />,
  twitter: <Twitter className="size-4" />,
  whatsapp: <MessageCircle className="size-4" />,
  facebook: <Facebook className="size-4" />,
  email: <Mail className="size-4" />,
};

export function ShareCard({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = React.useState(false);
  const links = buildShareLinks(url, title);
  const display = url.replace(/^https?:\/\//, "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — please copy manually.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* URL + copy */}
      <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-line bg-surface p-1.5 pl-3.5">
        <span className="flex-1 truncate text-[0.85rem] text-foreground">{display}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-ink px-3 py-2 text-[0.8rem] font-medium text-on-dark transition-colors hover:bg-ink-soft"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex gap-5">
        {/* QR */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-[var(--radius-md)] border border-line bg-white p-2.5">
            <QRCodeCanvas value={url} size={104} fgColor="#1a1712" bgColor="#ffffff" level="M" />
          </div>
          <span className="text-caption text-faint">Scan</span>
        </div>

        {/* Social */}
        <div className="flex flex-1 flex-col gap-2">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-[0.85rem]",
                "text-foreground transition-colors hover:bg-surface-2"
              )}
            >
              <span className="text-faint">{ICONS[l.id]}</span>
              {l.label}
              <ExternalLink className="ml-auto size-3.5 text-faint" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
