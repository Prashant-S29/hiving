import type { HomepageContent } from "./types";

// Migration fallback used until the fixed Homepage document is published.
// Production fallback behavior will be tightened after all CMS content is live.
export const mockHero: HomepageContent = {
  statusBar: {
    leftLabel: "Hi-Tech Vigilance · Est. 2025",
    liveLabel: "Live Intelligence Feed Active",
    rightLabel: "™ Type 42 · India · hivig.com",
  },
  mainEyebrow: "Hi-Tech Vigilance · Est. 2025",
  heading: {
    lead: "The",
    emphasis: "vigilant",
    middleLine: "voice of",
    outlineLine: "agentic AI",
  },
  introduction: [
    {
      _type: "block",
      _key: "homepage-introduction",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "intro-1",
          text: "The agentic AI space moves fast and talks loudly. Hivig cuts through both. ",
          marks: [],
        },
        { _type: "span", _key: "intro-2", text: "Technically rigorous", marks: ["strong"] },
        { _type: "span", _key: "intro-3", text: " enough for engineers and architects. ", marks: [] },
        { _type: "span", _key: "intro-4", text: "Strategically clear", marks: ["strong"] },
        {
          _type: "span",
          _key: "intro-5",
          text: " enough for product managers and executives. Independent enough to tell you the truth about every platform.",
          marks: [],
        },
      ],
    },
  ],
  primaryAction: { label: "Read the Latest Intel →", href: "/intel" },
  secondaryAction: { label: "What Hivig stands for", href: "/manifesto" },
  pickerEyebrow: "Choose your path · Hi-Tech Vigilance",
  choiceEyebrowLabel: "Choose",
  choiceActionLabel: "Go →",
  mediaType: "animation",
  sectionLayout: [
    { _key: "ticker", sectionKey: "ticker", enabled: true, spacing: "normal", variant: "default" },
    { _key: "stats", sectionKey: "stats", enabled: true, spacing: "normal", variant: "default" },
    { _key: "latest-intel", sectionKey: "latestIntel", enabled: true, spacing: "normal", variant: "default" },
    { _key: "manifesto", sectionKey: "manifesto", enabled: true, spacing: "normal", variant: "default" },
    { _key: "subscribe", sectionKey: "subscribe", enabled: true, spacing: "normal", variant: "default" },
  ],
  choices: [
    {
      label: "See What's Winning",
      description: "Live rankings of the AI models actually worth your attention.",
      href: "/race",
      accent: "signal",
    },
    {
      label: "Build It Right",
      description: "Describe the agent you need. Get a real quote, not a demo.",
      href: "/agents",
      accent: "verify",
    },
    {
      label: "Know Before You Build",
      description: "Independent analysis — no vendor hype, ever.",
      href: "/intel",
      accent: "amber",
    },
  ],
  etymology: [
    { _key: "hi", word: "Hi", definition: "Hi-Technology", italic: true },
    { _key: "vig", word: "Vig", definition: "Vigilance", italic: false },
    { _key: "hivig", word: "Hivig", definition: "A mandate, not a name", italic: true },
  ],
  tickerItems: [
    "AWS Bedrock Agents",
    "Salesforce Agentforce",
    "Microsoft Copilot Studio",
    "Google Gemini 2.0",
    "LangGraph Orchestration",
    "MCP Protocol",
    "CrewAI · AutoGen",
    "Azure AI Foundry",
    "Anthropic Claude",
  ],
  stats: [
    { _key: "platforms", value: "8", suffix: "+", label: "Platforms Independently Reviewed" },
    { _key: "sponsors", value: "Zero", suffix: "", label: "Vendor Sponsorships. Ever." },
    { _key: "tested", value: "100", suffix: "%", label: "Guides Tested Before Publishing" },
    { _key: "market", value: "$47", suffix: "B", label: "Market Under Our Watch" },
  ],
  latestIntel: {
    heading: "Latest",
    emphasis: "Intel",
    archiveLabel: "Full Archive →",
  },
  manifestoPromotion: {
    eyebrow: "The Hivig Manifesto",
    heading: "The agentic AI space has enough noise. We bring",
    emphasis: "signal.",
    action: { label: "Read the full manifesto →", href: "/manifesto" },
  },
  subscribePromotion: {
    eyebrow: "Stay Ahead of the Curve",
    heading: "The agentic AI brief that",
    emphasis: "matters.",
    action: { label: "Subscribe Free →", href: "/subscribe" },
  },
};
