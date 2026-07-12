/**
 * Central configuration for every outward-facing link.
 *
 * ── HOW TO EDIT ─────────────────────────────────────────────────────────
 * Fill in the `url` for placeholders below. Anything left as `null` is a
 * placeholder: the interface renders it disabled with a small "coming soon"
 * hint instead of a broken link. Never hardcode these URLs anywhere else.
 */

export type SocialLink = {
  id: "resume" | "github" | "linkedin" | "email" | "domain";
  label: string;
  /** null = clearly-marked placeholder; the UI degrades gracefully. */
  url: string | null;
  icon: string;
  /** Hint shown when the link is still a placeholder. */
  placeholderHint?: string;
};

export const socialLinks: SocialLink[] = [
  {
    id: "resume",
    label: "Resume",
    url: "/Rafia-Ali-Resume.pdf",
    icon: "📄",
  },
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/rafiaalikhawar",
    icon: "🐙",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    // PLACEHOLDER — replace with the real LinkedIn profile URL.
    url: null,
    icon: "💼",
    placeholderHint: "LinkedIn link coming soon",
  },
  {
    id: "email",
    label: "Email",
    // PLACEHOLDER — replace with "mailto:your@email.com".
    url: null,
    icon: "✉️",
    placeholderHint: "Email address being added",
  },
  {
    id: "domain",
    label: "Portfolio",
    // PLACEHOLDER — replace with the final portfolio domain.
    url: null,
    icon: "🌐",
    placeholderHint: "Domain coming soon",
  },
];

export const socialLinkMap = Object.fromEntries(
  socialLinks.map((l) => [l.id, l]),
) as Record<SocialLink["id"], SocialLink>;

export function getSocialLink(id: SocialLink["id"]): SocialLink {
  return socialLinkMap[id];
}

/** External project links that are real today. */
export const externalLinks = {
  hostelwalla: "https://hostel-walla2.vercel.app/",
} as const;
