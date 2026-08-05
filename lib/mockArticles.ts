import type { Article } from "@/lib/types";
import { awsBedrockMultiAgentOrchestrationBody } from "@/lib/content/awsBedrockMultiAgentOrchestrationBody";

export const mockArticles: Article[] = [
  {
    // Source: Intel/aws-bedrock-multi-agent-orchestration.md. Frontmatter mapped
    // onto the Sanity `article` schema fields (sanity/schemaTypes/article.ts) —
    // `target_keyword` and `og_description` were dropped, since neither has a
    // matching schema field and the brief said not to invent new ones.
    // Fields the source frontmatter didn't provide, filled in here and worth a
    // human double-check before this goes into real Sanity Studio content:
    //   - industryTag: inferred "tech-saas" (AWS Bedrock is unambiguously a
    //     tech/cloud infrastructure topic, but this wasn't in the source file).
    //   - deck: authored fresh — the frontmatter had no distinct 1-2 sentence
    //     summary field (meta_description is a separate, shorter SEO string).
    //   - author, featured: defaulted to match every other mock article's
    //     convention ("The Hivig Editorial Team", unfeatured).
    //   - publishedAt: source only gave "Aug 2026" (month precision); used the
    //     file's actual creation date (2026-08-02) rather than guessing a day.
    //   - metaDescription: source string was 163 chars, 3 over the schema's
    //     max(160) validation — trimmed by three words to fit.
    _id: "mock-6",
    title: "Why Enterprises Are Standardizing on AWS Bedrock for Multi-Agent Orchestration",
    slug: { current: "aws-bedrock-multi-agent-orchestration" },
    tagType: "deep-dive",
    industryTag: "tech-saas",
    deck: "AWS Bedrock's multi-agent orchestration routes requests from one supervisor agent to specialized sub-agents under a single IAM and compliance boundary — and a July 2026 deadline means most enterprises are migrating to it whether they planned to or not.",
    author: "The Hivig Editorial Team",
    readTimeMinutes: 13,
    publishedAt: "2026-08-02T09:00:00Z",
    platformTags: ["AWS Bedrock"],
    featured: false,
    metaDescription: "What AWS Bedrock's multi-agent orchestration model actually is, why enterprises are consolidating onto it now, what it costs, and how to try it free this week.",
    body: awsBedrockMultiAgentOrchestrationBody,
  },
  {
    _id: "mock-1",
    title: "The Autonomous Agent Is No Longer a Prototype. It Is Your Next Employee.",
    slug: { current: "autonomous-agent-next-employee" },
    tagType: "deep-dive",
    industryTag: "cross-industry",
    deck: "Enterprise AI crossed a threshold in 2025. Autonomous agents are no longer demos at conferences — they are signing contracts, triaging records, and writing code that ships to production.",
    author: "The Hivig Editorial Team",
    readTimeMinutes: 14,
    publishedAt: "2026-03-01T09:00:00Z",
    platformTags: ["AWS Bedrock", "Salesforce Agentforce"],
    featured: true,
  },
  {
    _id: "mock-2",
    title: "Build a Multi-Step Reasoning Agent on AWS Bedrock in 45 Minutes",
    slug: { current: "bedrock-agent-45-minutes" },
    tagType: "how-to",
    industryTag: "tech-saas",
    deck: "From IAM roles to Knowledge Base integration — a precise, production-grade walkthrough with no hand-waving.",
    author: "The Hivig Editorial Team",
    readTimeMinutes: 12,
    publishedAt: "2026-02-20T09:00:00Z",
    platformTags: ["AWS Bedrock"],
    featured: true,
  },
  {
    _id: "mock-3",
    title: "How Can AI Reduce SDR Prospecting Time for a B2B SaaS Sales Team?",
    slug: { current: "ai-reduce-sdr-prospecting-time" },
    tagType: "how-to",
    industryTag: "tech-saas",
    deck: "A workflow-level breakdown of where agentic AI genuinely saves SDR hours, and where it still requires human judgment.",
    author: "The Hivig Editorial Team",
    readTimeMinutes: 9,
    publishedAt: "2026-02-15T09:00:00Z",
    platformTags: ["Salesforce Agentforce", "AWS Bedrock"],
    featured: true,
  },
  {
    _id: "mock-4",
    title: "Which AI Models Are Best Suited for Enterprise Financial Research Workflows?",
    slug: { current: "ai-models-financial-research" },
    tagType: "verify",
    industryTag: "financial-services",
    deck: "We tested five frontier models against real financial research tasks. The results were not what the marketing pages suggest.",
    author: "The Hivig Editorial Team",
    readTimeMinutes: 11,
    publishedAt: "2026-02-10T09:00:00Z",
    platformTags: ["Anthropic Claude", "Google Gemini"],
    featured: true,
  },
  {
    _id: "mock-5",
    title: "The MCP Protocol Is the Most Important Standard Nobody Is Talking About",
    slug: { current: "mcp-protocol-standard" },
    tagType: "opinion",
    industryTag: "cross-industry",
    deck: "Anthropic's Model Context Protocol is quietly becoming the connective tissue of the agentic internet.",
    author: "The Hivig Editorial Team",
    readTimeMinutes: 8,
    publishedAt: "2026-02-05T09:00:00Z",
    platformTags: ["Anthropic Claude", "Open Source"],
  },
];
