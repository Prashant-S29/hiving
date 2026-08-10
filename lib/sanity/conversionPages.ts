import { cache as reactCache } from "react";
import { fetchCms } from "@/lib/sanity/fetch";
import { consultancyPageQuery, subscribePageQuery } from "@/lib/sanity/queries";
import type { CmsLink } from "@/lib/sanity/siteSettings";
import type { PageSeo } from "@/lib/sanity/companyPages";

export interface EnquiryFormCopy {
  namePlaceholder: string;
  emailPlaceholder: string;
  companyPlaceholder: string;
  messagePlaceholder: string;
  consentPrefix: string;
  privacyLabel: string;
  consentSuffix: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
}

export interface SubscribeFormCopy {
  namePlaceholder: string;
  emailPlaceholder: string;
  rolePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
}

export interface ConsultancyPageContent {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  introduction: string;
  services: Array<{ _key?: string; title: string; description: string }>;
  ctaHeading: string;
  ctaBody: string;
  ctaAction: CmsLink;
  enquiryEyebrow: string;
  enquiryHeadingLineOne: string;
  enquiryHeadingLineTwo: string;
  enquiryHeadingEmphasis: string;
  enquiryIntroduction: string;
  enquiryFormCaption: string;
  formCopy: EnquiryFormCopy;
  seo: PageSeo;
  enquirySeo: PageSeo;
}

export interface SubscribePageContent {
  eyebrow: string;
  headingLineOne: string;
  headingLineTwo: string;
  headingEmphasis: string;
  introduction: string;
  formCaption: string;
  benefits: string[];
  formCopy: SubscribeFormCopy;
  seo: PageSeo;
}

export const DEFAULT_ENQUIRY_FORM_COPY: EnquiryFormCopy = {
  namePlaceholder: "Your name",
  emailPlaceholder: "your@email.com",
  companyPlaceholder: "Company",
  messagePlaceholder: "Tell us what you're building",
  consentPrefix: "I agree to the processing of my data as described in the",
  privacyLabel: "Privacy Policy",
  consentSuffix: ".",
  submitLabel: "→  Send Enquiry",
  submittingLabel: "Submitting…",
  successMessage: "✓ Thanks — we typically respond within 48 hours.",
  errorMessage: "Something went wrong. Please try again.",
};

export const DEFAULT_SUBSCRIBE_FORM_COPY: SubscribeFormCopy = {
  namePlaceholder: "Your name",
  emailPlaceholder: "your@email.com",
  rolePlaceholder: "Your role (optional)",
  submitLabel: "→  Join the Waitlist",
  submittingLabel: "Submitting…",
  successMessage: "✓ You’re in — welcome to Hivig. Watch your inbox.",
  errorMessage: "Something went wrong. Please try again.",
};

export const DEFAULT_CONSULTANCY_PAGE: ConsultancyPageContent = {
  eyebrow: "Hivig Consulting",
  heading: "Independent expertise.",
  headingEmphasis: "Implementation that ships.",
  introduction:
    "The same independent rigour behind every Hivig verdict, applied directly to your organisation. We are not partnered with any single platform, which means our recommendation is the one that actually fits your stack — not the one that pays the best referral fee.",
  services: [
    { _key: "readiness", title: "Readiness Assessment", description: "A 2–4 week engagement that audits your stack, data, and security posture, and tells you exactly where agents create value." },
    { _key: "architecture", title: "Agent Architecture & Design", description: "Platform-agnostic design of your agent's reasoning loop, tool use, memory, and escalation paths." },
    { _key: "build", title: "Agent Build & Deployment", description: "Hands-on implementation across AWS Bedrock, Agentforce, Copilot Studio, Gemini, or open-source frameworks." },
    { _key: "evaluation", title: "LLM & Platform Evaluation", description: "A reproducible, structured evaluation of candidate platforms for your specific use case." },
    { _key: "governance", title: "AI Agent Governance & Safety", description: "Policy, audit logging, escalation design, and compliance mapping for regulated environments." },
    { _key: "training", title: "Team Enablement & Training", description: "Workshops and executive briefings so your team can run what gets built." },
  ],
  ctaHeading: "Tell us what you’re building.",
  ctaBody: "We typically respond within 48 hours to discuss scope, timeline, and whether Hivig is the right fit for what you need.",
  ctaAction: { label: "Enquire Now →", href: "/consultancy/enquire" },
  enquiryEyebrow: "Hivig Consulting",
  enquiryHeadingLineOne: "Tell us what",
  enquiryHeadingLineTwo: "you’re",
  enquiryHeadingEmphasis: "building.",
  enquiryIntroduction:
    "The same independent rigour behind every Hivig verdict, applied directly to your organisation. We typically respond within 48 hours to discuss scope, timeline, and whether Hivig is the right fit for what you need.",
  enquiryFormCaption: "Consultancy enquiry · hivig.com",
  formCopy: DEFAULT_ENQUIRY_FORM_COPY,
  seo: {
    metaTitle: "Hivig Consulting",
    metaDescription: "Helping brands design and deploy production-grade AI agents across AWS, Copilot, Agentforce, Gemini, and beyond.",
  },
  enquirySeo: {
    metaTitle: "Enquire — Hivig Consulting",
    metaDescription: "Tell us what you're building — Hivig Consulting responds within 48 hours.",
  },
};

export const DEFAULT_SUBSCRIBE_PAGE: SubscribePageContent = {
  eyebrow: "Stay Ahead of the Curve",
  headingLineOne: "The agentic AI",
  headingLineTwo: "brief that",
  headingEmphasis: "matters.",
  introduction:
    "Trusted by engineers, read by architects, and acted on by technology leaders. Platform verdicts, implementation guides, and clear-eyed takes on where autonomous AI is heading — no hype, no agenda, no noise.",
  formCaption: "Request early access · hivig.com",
  benefits: [
    "No spam. No vendor-sponsored content. Unsubscribe any time.",
    "Written for practitioners. Independent by design.",
  ],
  formCopy: DEFAULT_SUBSCRIBE_FORM_COPY,
  seo: {
    metaTitle: "Subscribe",
    metaDescription: "The agentic AI brief that matters — platform verdicts, implementation guides, no vendor sponsorships.",
  },
};

type PartialConsultancy = Partial<Omit<ConsultancyPageContent, "formCopy" | "seo" | "enquirySeo">> & {
  formCopy?: Partial<EnquiryFormCopy>;
  seo?: Partial<PageSeo>;
  enquirySeo?: Partial<PageSeo>;
};
type PartialSubscribe = Partial<Omit<SubscribePageContent, "formCopy" | "seo">> & {
  formCopy?: Partial<SubscribeFormCopy>;
  seo?: Partial<PageSeo>;
};

const cachePage = typeof reactCache === "function" ? reactCache : <T>(loader: () => Promise<T>) => loader;

export const getConsultancyPage = cachePage(async (): Promise<ConsultancyPageContent> => {
  const value = await fetchCms<PartialConsultancy | null>({
    query: consultancyPageQuery,
    fallback: null,
    label: "Consultancy pages",
    tags: ["sanity:page:consultancy"],
    required: true,
  });
  if (!value) return DEFAULT_CONSULTANCY_PAGE;
  return {
    ...DEFAULT_CONSULTANCY_PAGE,
    ...value,
    services: value.services?.length ? value.services : DEFAULT_CONSULTANCY_PAGE.services,
    ctaAction: { ...DEFAULT_CONSULTANCY_PAGE.ctaAction, ...value.ctaAction },
    formCopy: { ...DEFAULT_ENQUIRY_FORM_COPY, ...value.formCopy },
    seo: { ...DEFAULT_CONSULTANCY_PAGE.seo, ...value.seo },
    enquirySeo: { ...DEFAULT_CONSULTANCY_PAGE.enquirySeo, ...value.enquirySeo },
  };
});

export const getSubscribePage = cachePage(async (): Promise<SubscribePageContent> => {
  const value = await fetchCms<PartialSubscribe | null>({
    query: subscribePageQuery,
    fallback: null,
    label: "Subscribe page",
    tags: ["sanity:page:subscribe"],
    required: true,
  });
  if (!value) return DEFAULT_SUBSCRIBE_PAGE;
  return {
    ...DEFAULT_SUBSCRIBE_PAGE,
    ...value,
    benefits: value.benefits?.length ? value.benefits : DEFAULT_SUBSCRIBE_PAGE.benefits,
    formCopy: { ...DEFAULT_SUBSCRIBE_FORM_COPY, ...value.formCopy },
    seo: { ...DEFAULT_SUBSCRIBE_PAGE.seo, ...value.seo },
  };
});
