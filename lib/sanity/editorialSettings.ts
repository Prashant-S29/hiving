import { cache } from "react";
import { fetchCms } from "@/lib/sanity/fetch";
import { editorialSettingsQuery } from "@/lib/sanity/queries";
import type { TagType } from "@/lib/types";

export interface EditorialSettings {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  introduction: string;
  categories: Array<{ _key?: string; value: TagType; label: string }>;
  allCategoriesLabel: string;
  allPlatformsLabel: string;
  noArticlesMessage: string;
  noMatchesMessage: string;
  paginationAriaLabel: string;
  previousPageLabel: string;
  nextPageLabel: string;
  backToArchiveLabel: string;
  minuteShortLabel: string;
  minuteReadLabel: string;
  missingBodyMessage: string;
  lastReviewedLabel: string;
  sourcesHeading: string;
  relatedArticlesHeading: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImageUrl?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
}

export const DEFAULT_EDITORIAL_SETTINGS: EditorialSettings = {
  eyebrow: "All Intel",
  heading: "Independent Agentic AI",
  headingEmphasis: "Analysis",
  introduction:
    "Deep dives, how-to guides, watchdog reports, and opinion — fact-checked, platform-agnostic, and free of vendor sponsorship.",
  categories: [
    { value: "deep-dive", label: "Deep Dive" },
    { value: "how-to", label: "How-To Guide" },
    { value: "watchdog", label: "Watchdog Report" },
    { value: "opinion", label: "Opinion" },
    { value: "verify", label: "Fact-Checked Analysis" },
  ],
  allCategoriesLabel: "All",
  allPlatformsLabel: "All Platforms",
  noArticlesMessage: "No articles published yet. Publish your first piece in Sanity Studio.",
  noMatchesMessage: "No articles match these filters.",
  paginationAriaLabel: "Pagination",
  previousPageLabel: "← Prev",
  nextPageLabel: "Next →",
  backToArchiveLabel: "← All Intel",
  minuteShortLabel: "min",
  minuteReadLabel: "min read",
  missingBodyMessage: "Full article content will appear here once it is published from Sanity Studio.",
  lastReviewedLabel: "Last reviewed",
  sourcesHeading: "Sources",
  relatedArticlesHeading: "Related Intel",
  seo: {
    metaTitle: "Intel — Independent Agentic AI Analysis",
    metaDescription:
      "Deep dives, how-to guides, watchdog reports, and opinion on agentic AI platforms — fact-checked, platform-agnostic, no vendor sponsorships.",
  },
};

type PartialEditorialSettings = Partial<Omit<EditorialSettings, "seo">> & {
  seo?: Partial<EditorialSettings["seo"]>;
};

export const getEditorialSettings = cache(async (): Promise<EditorialSettings> => {
  const value = await fetchCms<PartialEditorialSettings | null>({
    query: editorialSettingsQuery,
    fallback: null,
    label: "editorial settings",
    tags: ["sanity:editorial-settings"],
    required: true,
  });

  if (!value) return DEFAULT_EDITORIAL_SETTINGS;
  return {
    ...DEFAULT_EDITORIAL_SETTINGS,
    ...value,
    categories: value.categories?.length ? value.categories : DEFAULT_EDITORIAL_SETTINGS.categories,
    seo: { ...DEFAULT_EDITORIAL_SETTINGS.seo, ...value.seo },
  };
});

export function categoryLabels(settings: EditorialSettings): Record<TagType, string> {
  const labels = Object.fromEntries(settings.categories.map((category) => [category.value, category.label]));
  return {
    "deep-dive": labels["deep-dive"] || "Deep Dive",
    "how-to": labels["how-to"] || "How-To Guide",
    watchdog: labels.watchdog || "Watchdog Report",
    opinion: labels.opinion || "Opinion",
    verify: labels.verify || "Fact-Checked Analysis",
  };
}
