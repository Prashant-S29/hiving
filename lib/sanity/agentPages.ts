import { cache as reactCache } from "react";
import { fetchCms } from "@/lib/sanity/fetch";
import { agentDiscoverPageQuery, agentPricingPageQuery, agentStorePageQuery } from "@/lib/sanity/queries";
import type { PageSeo } from "@/lib/sanity/companyPages";
import type { CmsLink } from "@/lib/sanity/siteSettings";

export interface AgentQuoteFormCopy {
  promptLabel: string;
  promptPlaceholder: string;
  submitLabel: string;
  loadingLabel: string;
  fallbackError: string;
  networkError: string;
  regionLabel: string;
  modelLabel: string;
  tokensLabel: string;
  hoursLabel: string;
  tierLabel: string;
  modelCostLabel: string;
  humanCostLabel: string;
  quoteDisclaimer: string;
}

export interface AgentStorePageContent {
  eyebrow: string;
  heading: string;
  introLead: string;
  pricingAction: CmsLink;
  introMiddle: string;
  discoverAction: CmsLink;
  introTail: string;
  formCopy: AgentQuoteFormCopy;
  seo: PageSeo;
}

export interface AgentPricingPageContent {
  backAction: CmsLink;
  heading: string;
  introduction: string;
  regionalHeading: string;
  regionColumnLabel: string;
  multiplierColumnLabel: string;
  regionLabels: Record<string, string>;
  multiplierSuffix: string;
  disclaimer: string;
  seo: PageSeo;
}

export interface DiscoverInterfaceCopy {
  placeholder: string;
  submitLabel: string;
  loadingLabel: string;
  loadingMessage: string;
  fallbackError: string;
  networkError: string;
  agentStoreLabel: string;
  discoverLabel: string;
  generatedForLabel: string;
  conceptPreviewLabel: string;
  feasibleLabel: string;
  caveatsLabel: string;
  notFeasibleLabel: string;
  regionLabel: string;
  tierLabel: string;
  oversightLabel: string;
  estimateDisclaimer: string;
  pricingLinkLabel: string;
  capabilitiesHeading: string;
  risksHeading: string;
  assumptionsHeading: string;
}

export interface AgentDiscoverPageContent {
  eyebrow: string;
  heading: string;
  introduction: string;
  interfaceCopy: DiscoverInterfaceCopy;
  seo: PageSeo;
}

export const DEFAULT_QUOTE_FORM_COPY: AgentQuoteFormCopy = {
  promptLabel: "Describe the agent you want",
  promptPlaceholder: "e.g. An agent that reads incoming support emails, classifies urgency, drafts a reply, and escalates production issues to Slack.",
  submitLabel: "Get a quote",
  loadingLabel: "Getting quote…",
  fallbackError: "Something went wrong.",
  networkError: "Could not reach the quote service.",
  regionLabel: "Region",
  modelLabel: "Model",
  tokensLabel: "Estimated tokens",
  hoursLabel: "Estimated human hours",
  tierLabel: "Expertise tier",
  modelCostLabel: "Model credits cost",
  humanCostLabel: "Human hours cost",
  quoteDisclaimer: "This is a quote only — no order or payment has been captured. Order capture without live checkout is a v1 follow-up per BUILD_BRIEF.md Day 3.",
};

export const DEFAULT_AGENT_STORE_PAGE: AgentStorePageContent = {
  eyebrow: "Instant quote",
  heading: "The Agent Store",
  introLead: "Describe the AI agent you want in plain language. Hivig estimates the model usage and human oversight it will take to build, tests it, and quotes a price adjusted for your region —",
  pricingAction: { label: "see how quotes are calculated", href: "/agents/pricing" },
  introMiddle: ". Prefer a faster, more visual flow?",
  discoverAction: { label: "Try Discover", href: "/agents/discover" },
  introTail: "for an instant, AI-generated feasibility page.",
  formCopy: DEFAULT_QUOTE_FORM_COPY,
  seo: {
    metaTitle: "Agent Store — Order a Custom AI Agent",
    metaDescription: "Describe the AI agent you want, get a geo-adjusted price quote built from model credits and human oversight hours, and order a tested, deployed agent.",
  },
};

export const DEFAULT_AGENT_PRICING_PAGE: AgentPricingPageContent = {
  backAction: { label: "← Back to the Agent Store", href: "/agents" },
  heading: "How pricing works",
  introduction: "As of today, a quote is built from four steps: (1) classify your request into estimated model tokens, human oversight hours (10–180hr band), and an expertise tier; (2) compute internal cost = model credits at actual API cost + human hours × loaded hourly rate; (3) apply a markup for margin; (4) apply a regional multiplier, PPP-adjusted like Netflix or Spotify regional pricing.",
  regionalHeading: "Regional multiplier",
  regionColumnLabel: "Region",
  multiplierColumnLabel: "Multiplier",
  regionLabels: { US: "United States", EU: "European Union", IN: "India", DEFAULT: "Rest of world" },
  multiplierSuffix: "×",
  disclaimer: "Pricing is regional and non-transferable — see BUILD_BRIEF.md section 5 for the ToS and VPN-arbitrage note before this goes live with real payment methods, since IP-based geo alone can be bypassed the way Netflix handles with payment-method/billing-country checks.",
  seo: {
    metaTitle: "How Agent Store Pricing Works",
    metaDescription: "How Hivig quotes custom AI agent builds: model credits, human oversight hours, markup, and regional (PPP-adjusted) pricing.",
  },
};

export const DEFAULT_DISCOVER_INTERFACE_COPY: DiscoverInterfaceCopy = {
  placeholder: "What do you want your AI agent to do?",
  submitLabel: "Search",
  loadingLabel: "Building…",
  loadingMessage: "Generating your feasibility study…",
  fallbackError: "Something went wrong.",
  networkError: "Could not reach the feasibility service.",
  agentStoreLabel: "Agent Store",
  discoverLabel: "Discover",
  generatedForLabel: "Generated for:",
  conceptPreviewLabel: "Concept preview — not a real screenshot",
  feasibleLabel: "✅ Feasible",
  caveatsLabel: "⚠️ Feasible with caveats",
  notFeasibleLabel: "✕ Not feasible as described",
  regionLabel: "Region",
  tierLabel: "tier",
  oversightLabel: "estimated oversight",
  estimateDisclaimer: "This is a feasibility study and price estimate only — no order has been placed.",
  pricingLinkLabel: "See how this is calculated",
  capabilitiesHeading: "About this agent",
  risksHeading: "Risks & open questions",
  assumptionsHeading: "Assumptions made",
};

export const DEFAULT_AGENT_DISCOVER_PAGE: AgentDiscoverPageContent = {
  eyebrow: "AI-generated, instant",
  heading: "Discover",
  introduction: "Describe what you want in plain language. We’ll tell you honestly whether it’s buildable, and generate a full feasibility page for it — instantly.",
  interfaceCopy: DEFAULT_DISCOVER_INTERFACE_COPY,
  seo: {
    metaTitle: "Discover — Describe an Agent, Get an Instant Feasibility Study",
    metaDescription: "Type what you want your AI agent to do and get an instant, AI-generated feasibility study and price estimate.",
  },
};

type PartialStore = Partial<Omit<AgentStorePageContent, "formCopy" | "seo">> & { formCopy?: Partial<AgentQuoteFormCopy>; seo?: Partial<PageSeo> };
type PartialPricing = Partial<Omit<AgentPricingPageContent, "seo">> & { seo?: Partial<PageSeo> };
type PartialDiscover = Partial<Omit<AgentDiscoverPageContent, "interfaceCopy" | "seo">> & { interfaceCopy?: Partial<DiscoverInterfaceCopy>; seo?: Partial<PageSeo> };
const cachePage = typeof reactCache === "function" ? reactCache : <T>(loader: () => Promise<T>) => loader;

export const getAgentStorePage = cachePage(async (): Promise<AgentStorePageContent> => {
  const value = await fetchCms<PartialStore | null>({ query: agentStorePageQuery, fallback: null, label: "Agent Store page", tags: ["sanity:page:agents"], required: true });
  if (!value) return DEFAULT_AGENT_STORE_PAGE;
  return {
    ...DEFAULT_AGENT_STORE_PAGE,
    ...value,
    pricingAction: { ...DEFAULT_AGENT_STORE_PAGE.pricingAction, ...value.pricingAction },
    discoverAction: { ...DEFAULT_AGENT_STORE_PAGE.discoverAction, ...value.discoverAction },
    formCopy: { ...DEFAULT_QUOTE_FORM_COPY, ...value.formCopy },
    seo: { ...DEFAULT_AGENT_STORE_PAGE.seo, ...value.seo },
  };
});

export const getAgentPricingPage = cachePage(async (): Promise<AgentPricingPageContent> => {
  const value = await fetchCms<PartialPricing | null>({ query: agentPricingPageQuery, fallback: null, label: "Agent Pricing page", tags: ["sanity:page:agent-pricing"], required: true });
  if (!value) return DEFAULT_AGENT_PRICING_PAGE;
  return {
    ...DEFAULT_AGENT_PRICING_PAGE,
    ...value,
    backAction: { ...DEFAULT_AGENT_PRICING_PAGE.backAction, ...value.backAction },
    regionLabels: { ...DEFAULT_AGENT_PRICING_PAGE.regionLabels, ...value.regionLabels },
    seo: { ...DEFAULT_AGENT_PRICING_PAGE.seo, ...value.seo },
  };
});

export const getAgentDiscoverPage = cachePage(async (): Promise<AgentDiscoverPageContent> => {
  const value = await fetchCms<PartialDiscover | null>({ query: agentDiscoverPageQuery, fallback: null, label: "Agent Discover page", tags: ["sanity:page:agent-discover"], required: true });
  if (!value) return DEFAULT_AGENT_DISCOVER_PAGE;
  return {
    ...DEFAULT_AGENT_DISCOVER_PAGE,
    ...value,
    interfaceCopy: { ...DEFAULT_DISCOVER_INTERFACE_COPY, ...value.interfaceCopy },
    seo: { ...DEFAULT_AGENT_DISCOVER_PAGE.seo, ...value.seo },
  };
});
