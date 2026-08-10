import type { PortableTextBlock, TypedObject } from "@portabletext/types";

export type ArticleBodyBlock = PortableTextBlock | (TypedObject & Record<string, unknown>);

export type TagType = "deep-dive" | "how-to" | "watchdog" | "opinion" | "verify";

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  tagType: TagType;
  industryTag: string;
  deck: string;
  heroImage?: { asset: { _ref: string } };
  heroImageAlt?: string;
  body?: ArticleBodyBlock[];
  author: string;
  authorDetails?: {
    name: string;
    slug: string;
    role?: string;
    biography?: string;
    portraitUrl?: string;
    portraitAlt?: string;
    credentials?: string[];
  };
  readTimeMinutes: number;
  publishedAt: string;
  platformTags?: string[];
  featured?: boolean;
  featurePriority?: number;
  reviewedAt?: string;
  sources?: Array<{
    name: string;
    url: string;
    publicationDate?: string;
    accessedDate?: string;
    sourceType?: string;
    summary?: string;
    verificationStatus?: "unverified" | "review" | "verified";
  }>;
  relatedArticles?: Article[];
  metaTitle?: string;
  metaDescription?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

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

export interface HomepageAction {
  label: string;
  href: string;
  openInNewTab?: boolean;
  ariaLabel?: string;
}

export interface HomepageStat {
  _key?: string;
  value: string;
  suffix: string;
  label: string;
}

export type HomepageSectionKey = "ticker" | "stats" | "latestIntel" | "manifesto" | "subscribe";
export type HomepageSectionSpacing = "compact" | "normal" | "large";
export type HomepageSectionVariant = "default" | "alternate";

export interface HomepageSectionControl {
  _key?: string;
  sectionKey: HomepageSectionKey;
  enabled: boolean;
  spacing: HomepageSectionSpacing;
  variant: HomepageSectionVariant;
}

export interface HomepageContent {
  statusBar: {
    leftLabel: string;
    liveLabel: string;
    rightLabel: string;
  };
  mainEyebrow: string;
  heading: {
    lead: string;
    emphasis: string;
    middleLine: string;
    outlineLine: string;
  };
  introduction: PortableTextBlock[];
  primaryAction: HomepageAction;
  secondaryAction: HomepageAction;
  pickerEyebrow: string;
  choiceEyebrowLabel: string;
  choiceActionLabel: string;
  mediaType: HeroMediaType;
  heroImage?: { asset: { _ref: string } };
  heroVideoUrl?: string;
  choices: HeroChoice[];
  sectionLayout: HomepageSectionControl[];
  etymology: Array<{
    _key?: string;
    word: string;
    definition: string;
    italic?: boolean;
  }>;
  tickerItems: string[];
  stats: HomepageStat[];
  latestIntel: {
    heading: string;
    emphasis: string;
    archiveLabel: string;
  };
  manifestoPromotion: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    action: HomepageAction;
  };
  subscribePromotion: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    action: HomepageAction;
  };
}
