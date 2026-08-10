import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

interface SanityWebhookPayload {
  _id?: string;
  _type?: string;
  slug?: string;
  pageKey?: string;
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Revalidation is not configured." }, { status: 503 });
  }

  const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(request, secret);
  if (!isValidSignature) {
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }
  if (!body?._type) {
    return Response.json({ error: "Missing document type." }, { status: 400 });
  }

  const tags = new Set<string>(["sanity"]);

  switch (body._type) {
    case "siteSettings":
      tags.add("sanity:site-settings");
      break;
    case "editorialSettings":
      tags.add("sanity:editorial-settings");
      tags.add("sanity:articles");
      tags.add("sanity:page:home");
      break;
    case "article":
      tags.add("sanity:articles");
      if (body.slug) tags.add(`sanity:article:${body.slug}`);
      break;
    case "author":
    case "industry":
    case "platform":
      tags.add("sanity:articles");
      break;
    case "articleType":
      tags.add("sanity:articles");
      tags.add("sanity:editorial-settings");
      break;
    case "homepageHero":
      tags.add("sanity:page:home");
      break;
    case "aboutPage":
      tags.add("sanity:page:about");
      break;
    case "manifestoPage":
      tags.add("sanity:page:manifesto");
      tags.add("sanity:page:home");
      break;
    case "raceSettings":
      tags.add("sanity:page:race");
      break;
    case "aiModel":
    case "organization":
    case "benchmarkRecord":
      tags.add("sanity:race-models");
      break;
    case "sourceCitation":
      tags.add("sanity:race-models");
      tags.add("sanity:articles");
      break;
    case "agentStorePage":
      tags.add("sanity:page:agents");
      break;
    case "agentPricingPage":
      tags.add("sanity:page:agent-pricing");
      break;
    case "agentDiscoverPage":
      tags.add("sanity:page:agent-discover");
      break;
    case "consultancyPage":
      tags.add("sanity:page:consultancy");
      break;
    case "subscribePage":
      tags.add("sanity:page:subscribe");
      tags.add("sanity:page:home");
      break;
    case "privacyPage":
      tags.add("sanity:page:privacy");
      break;
    case "termsPage":
      tags.add("sanity:page:terms");
      break;
    case "notFoundPage":
      tags.add("sanity:page:not-found");
      break;
    case "page":
      tags.add("sanity:pages");
      if (body.pageKey) tags.add(`sanity:page:${body.pageKey}`);
      break;
  }

  for (const tag of tags) revalidateTag(tag);

  return Response.json({ revalidated: true, tags: [...tags] });
}
