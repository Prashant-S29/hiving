import { cache as reactCache } from "react";
import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";
import { fetchCms } from "@/lib/sanity/fetch";
import { aboutPageQuery, manifestoPageQuery } from "@/lib/sanity/queries";

export interface PageSeo {
  metaTitle: string;
  metaDescription: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface AboutPageContent {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  body: PortableTextBlock[];
  seo: PageSeo;
}

export interface ManifestoPageContent {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  nameSectionTitle: string;
  etymology: Array<{ _key?: string; term: string; definition: string }>;
  equationWord: string;
  equationEmphasis?: string;
  equationCaption: string;
  positionQuote: string;
  positionAttribution: string;
  whySectionTitle: string;
  whyLead: string;
  whyBody: PortableTextBlock[];
  principles: Array<{ _key?: string; number: string; title: string; body: string }>;
  seo: PageSeo;
}

function block(key: string, text: string, style: "normal" | "h2" | "h3" = "normal"): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

function markedBlock(key: string, children: PortableTextSpan[]): PortableTextBlock {
  return { _type: "block", _key: key, style: "normal", markDefs: [], children };
}

export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  eyebrow: "About",
  heading: "About",
  headingEmphasis: "Hivig",
  body: [
    block(
      "about-origin",
      "Hivig is an independent intelligence platform covering agentic AI: autonomous systems built on platforms like AWS Bedrock, Salesforce Agentforce, Microsoft Copilot Studio, and Google Gemini. The name comes from Hi-Technology plus Vigilance, and that combination is the operating principle behind everything published here."
    ),
    block(
      "about-independence",
      "Every model, agent, and vendor covered on this platform receives the same treatment: an independently produced score, an explicit breakdown of evidence versus marketing claim, and a visible last-reviewed date. Hivig accepts no payment in exchange for ranking, placement, or favourable coverage of any model, agent, or vendor. That line does not move regardless of how large the company on the other side of it happens to be."
    ),
    block(
      "about-company",
      "Hivig is published by Naganarai Media Tech Private Limited, registered under trademark Class 42 in India. The trademark covers computer programming, software design, systems analysis, and technological research, which is the same scope that underpins both the editorial work published here and the consultancy services offered separately."
    ),
    block("about-standards-heading", "Editorial Standards", "h2"),
    block(
      "about-standards",
      "Every guide published on Hivig is tested in a real environment before publication. Every benchmark claim traces to a named, verifiable source. Corrections, when needed, are made visibly rather than silently edited away."
    ),
    block("about-write-heading", "Write for Hivig", "h2"),
    block(
      "about-write",
      "Hivig is building a network of verified expert contributors — practitioners and consultants who publish verdicts and case studies under their own name and credentials. If that’s you, reach out through the subscribe page and mention you’d like to contribute."
    ),
  ],
  seo: {
    metaTitle: "About Hivig",
    metaDescription: "The origin, the mission, and the editorial standards behind Hivig.",
  },
};

export const DEFAULT_MANIFESTO_PAGE: ManifestoPageContent = {
  eyebrow: "The Hivig Manifesto",
  heading: "The agentic AI space has enough noise. We bring",
  headingEmphasis: "signal.",
  nameSectionTitle: "The Name. The Mandate.",
  etymology: [
    { _key: "hi", term: "Hi", definition: "Hi-Technology — precision, advancement, and the relentless forward motion of machine intelligence." },
    { _key: "vig", term: "Vig", definition: "Vigilance — the act of keeping careful watch. Not passive observation. Active, purposeful scrutiny." },
  ],
  equationWord: "Hivig",
  equationEmphasis: "Hi",
  equationCaption: "A mandate, not a portmanteau",
  positionQuote: "Speed of deployment is not the same as readiness. The platforms racing to ship agents need watchdogs, not cheerleaders. That watchdog is Hivig.",
  positionAttribution: "— Hivig Editorial Position",
  whySectionTitle: "Why This Publication Exists",
  whyLead: "The agentic AI revolution does not need more hype. It needs more honesty. The gap between what platforms claim in press releases and what developers experience in production is wide, and growing wider by the week.",
  whyBody: [
    markedBlock("manifesto-why-1", [
      { _type: "span", _key: "m1a", text: "Hivig was founded to close that gap. ", marks: [] },
      { _type: "span", _key: "m1b", text: "We believe the most important thing any publication can be in this space is trustworthy.", marks: ["strong"] },
      { _type: "span", _key: "m1c", text: " That means we will tell you when an LLM underperforms its marketing. It means we will critique a platform that ships recklessly, regardless of that company’s advertising budget. It means we take the relationship between artificial intelligence and human beings seriously, not as a philosophical exercise but as an ethical obligation.", marks: [] },
    ]),
    markedBlock("manifesto-why-2", [
      { _type: "span", _key: "m2a", text: "It also means we will champion genuine breakthroughs with ", marks: [] },
      { _type: "span", _key: "m2b", text: "real enthusiasm", marks: ["signal"] },
      { _type: "span", _key: "m2c", text: ", because this technology, deployed responsibly and intelligently, has the potential to compress decades of human progress into years. We are ", marks: [] },
      { _type: "span", _key: "m2d", text: "optimists. Rigorous, well-informed, uncompromising optimists.", marks: ["strong"] },
    ]),
    block(
      "manifesto-why-3",
      "The work speaks. Every article we publish is a proof of intent. Every verdict we issue is a test of our integrity. Come back in six months. Come back in two years. Judge us by what we’ve built."
    ),
  ],
  principles: [
    { _key: "truth", number: "01 · Truth First", title: "Factually Unimpeachable", body: "Every claim is verified. Every benchmark is reproducible. If we get something wrong, we correct it visibly and without equivocation." },
    { _key: "voice", number: "02 · Voice", title: "Opinionated When It Earns It", body: "We are not neutral for neutrality's sake. We form views, carefully and evidentially, and we state them plainly." },
    { _key: "ethics", number: "03 · Ethics", title: "AI & Humanity, Honestly", body: "We write about the relationship between artificial intelligence and human beings as if it actually matters. Because it does." },
    { _key: "independence", number: "04 · Independence", title: "No Allegiance. No Platform.", body: "We cover every major platform with identical rigour. We are not on anyone's payroll. Our readers are our only constituency." },
  ],
  seo: {
    metaTitle: "The Hivig Manifesto",
    metaDescription: "Hi-Technology plus Vigilance. Why Hivig exists, and the four principles it operates by.",
  },
};

type PartialAbout = Partial<Omit<AboutPageContent, "seo">> & { seo?: Partial<PageSeo> };
type PartialManifesto = Partial<Omit<ManifestoPageContent, "seo">> & { seo?: Partial<PageSeo> };

const cachePage = typeof reactCache === "function"
  ? reactCache
  : <T>(loader: () => Promise<T>) => loader;

export const getAboutPage = cachePage(async (): Promise<AboutPageContent> => {
  const value = await fetchCms<PartialAbout | null>({
    query: aboutPageQuery,
    fallback: null,
    label: "About page",
    tags: ["sanity:page:about"],
    required: true,
  });
  if (!value) return DEFAULT_ABOUT_PAGE;
  return {
    ...DEFAULT_ABOUT_PAGE,
    ...value,
    body: value.body?.length ? value.body : DEFAULT_ABOUT_PAGE.body,
    seo: { ...DEFAULT_ABOUT_PAGE.seo, ...value.seo },
  };
});

export const getManifestoPage = cachePage(async (): Promise<ManifestoPageContent> => {
  const value = await fetchCms<PartialManifesto | null>({
    query: manifestoPageQuery,
    fallback: null,
    label: "Manifesto page",
    tags: ["sanity:page:manifesto"],
    required: true,
  });
  if (!value) return DEFAULT_MANIFESTO_PAGE;
  return {
    ...DEFAULT_MANIFESTO_PAGE,
    ...value,
    etymology: value.etymology?.length ? value.etymology : DEFAULT_MANIFESTO_PAGE.etymology,
    whyBody: value.whyBody?.length ? value.whyBody : DEFAULT_MANIFESTO_PAGE.whyBody,
    principles: value.principles?.length ? value.principles : DEFAULT_MANIFESTO_PAGE.principles,
    seo: { ...DEFAULT_MANIFESTO_PAGE.seo, ...value.seo },
  };
});
