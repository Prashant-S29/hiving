// Pure filtering/pagination logic for the Intel index, kept separate from
// the page component so it's independently reasoned about (and testable)
// without needing a rendered React tree.

import type { Article } from "./types";

export const ARTICLES_PAGE_SIZE = 6;

export function filterArticles(articles: Article[], category?: string, platform?: string): Article[] {
  return articles.filter((a) => {
    if (category && a.tagType !== category) return false;
    if (platform && !(a.platformTags ?? []).includes(platform)) return false;
    return true;
  });
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
}

export function paginate<T>(items: T[], requestedPage: number, pageSize: number = ARTICLES_PAGE_SIZE): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage || 1), totalPages);
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, totalPages };
}

// Derived from the full, unfiltered article set (not the currently
// filtered result) so the tag cloud stays stable as a user filters by
// category, instead of platform options disappearing mid-browse.
export function allPlatformTags(articles: Article[]): string[] {
  return Array.from(new Set(articles.flatMap((a) => a.platformTags ?? []))).sort();
}
