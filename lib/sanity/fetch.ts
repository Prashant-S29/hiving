import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import { client, sanityConfigured } from "@/lib/sanity/client";

interface CmsFetchOptions<T> {
  query: string;
  params?: QueryParams;
  fallback: T;
  label: string;
  tags?: string[];
  required?: boolean;
}

// Fixtures/defaults are a local-development convenience only. Production must
// expose CMS configuration/query failures unless an operator explicitly enables
// a temporary emergency fallback.
export const cmsFallbacksEnabled =
  process.env.NODE_ENV !== "production" || process.env.SANITY_ALLOW_FALLBACKS === "true";

function cmsFailure(label: string, reason: string, cause?: unknown) {
  const error = new Error(`[Sanity] ${label}: ${reason}`, cause ? { cause } : undefined);
  console.error(error.message, cause || "");
  return error;
}

/** Centralized published/draft fetch boundary with cache tags and strict production failures. */
export async function fetchCms<T>({
  query,
  params = {},
  fallback,
  label,
  tags = [],
  required = false,
}: CmsFetchOptions<T>): Promise<T> {
  if (!sanityConfigured || !client) {
    if (cmsFallbacksEnabled) return fallback;
    throw cmsFailure(label, "Sanity project or dataset is not configured");
  }

  try {
    // generateStaticParams runs without a request store during production builds.
    // In that context there cannot be an authenticated draft session, so use the
    // published perspective rather than falling back from an otherwise valid query.
    let previewEnabled = false;
    try {
      previewEnabled = draftMode().isEnabled;
    } catch {
      previewEnabled = false;
    }
    const token = process.env.SANITY_API_READ_TOKEN;

    if (previewEnabled && !token) {
      throw cmsFailure(label, "Draft Mode is enabled but SANITY_API_READ_TOKEN is missing");
    }

    const requestClient = previewEnabled && token
      ? client.withConfig({
          token,
          useCdn: false,
          perspective: "drafts",
          stega: { enabled: true, studioUrl: "/studio" },
        })
      : client;

    const result = await requestClient.fetch<T | null>(
      query,
      params,
      previewEnabled
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: ["sanity", ...tags] } }
    );
    if (result == null && required) {
      if (cmsFallbacksEnabled) return fallback;
      throw cmsFailure(label, "required content is missing or unpublished");
    }
    return result ?? fallback;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("[Sanity]")) {
      if (cmsFallbacksEnabled) return fallback;
      throw error;
    }
    const failure = cmsFailure(label, "query failed", error);
    if (cmsFallbacksEnabled) return fallback;
    throw failure;
  }
}
