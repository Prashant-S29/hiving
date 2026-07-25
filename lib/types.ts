export type TagType = "deep-dive" | "how-to" | "watchdog" | "opinion" | "verify";

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  tagType: TagType;
  industryTag: string;
  deck: string;
  heroImage?: { asset: { _ref: string } };
  body?: unknown[];
  author: string;
  readTimeMinutes: number;
  publishedAt: string;
  platformTags?: string[];
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export const TAG_LABELS: Record<TagType, string> = {
  "deep-dive": "Deep Dive",
  "how-to": "How-To Guide",
  watchdog: "Watchdog Report",
  opinion: "Opinion",
  verify: "Fact-Checked Analysis",
};

export const TAG_COLORS: Record<TagType, string> = {
  "deep-dive": "text-signal border-signal",
  "how-to": "text-amber border-amber",
  watchdog: "text-amber border-amber",
  opinion: "text-signal border-signal",
  verify: "text-verify border-verify",
};

export type HeroAccent = "signal" | "verify" | "amber";
export type HeroMediaType = "animation" | "image" | "video";

export interface HeroChoice {
  label: string;
  description: string;
  href: string;
  accent: HeroAccent;
}

export interface HomepageHero {
  eyebrow: string;
  mediaType: HeroMediaType;
  heroImage?: { asset: { _ref: string } };
  heroVideoUrl?: string;
  choices: HeroChoice[];
}
