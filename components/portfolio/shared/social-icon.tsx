import {
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Dribbble,
  Globe,
  Mail,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import type { Social } from "@/lib/portfolio/schema";

const ICONS: Record<Social["platform"], LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  behance: ExternalLink,
  dribbble: Dribbble,
  medium: ExternalLink,
  kaggle: ExternalLink,
  leetcode: ExternalLink,
  stackoverflow: ExternalLink,
  website: Globe,
  email: Mail,
  custom: Globe,
};

export function socialIcon(platform: Social["platform"]): LucideIcon {
  return ICONS[platform] ?? Globe;
}

const DEFAULT_LABELS: Record<Social["platform"], string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter",
  instagram: "Instagram",
  youtube: "YouTube",
  behance: "Behance",
  dribbble: "Dribbble",
  medium: "Medium",
  kaggle: "Kaggle",
  leetcode: "LeetCode",
  stackoverflow: "Stack Overflow",
  website: "Website",
  email: "Email",
  custom: "Link",
};

export function socialLabel(s: Social): string {
  return s.label?.trim() || DEFAULT_LABELS[s.platform];
}

export function socialHref(s: Social): string {
  if (s.platform === "email") {
    return s.url.startsWith("mailto:") ? s.url : `mailto:${s.url}`;
  }
  return s.url;
}
