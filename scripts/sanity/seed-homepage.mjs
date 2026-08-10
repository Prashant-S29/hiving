import fs from "node:fs";
import { createClient } from "@sanity/client";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;
  for (const rawLine of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !token) throw new Error("Sanity project, dataset, and Editor write token are required.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const internalLink = (internalPath) => ({ _type: "link", linkType: "internal", internalPath });
const action = (label, path, style) => ({ _type: "callToAction", label, link: internalLink(path), style });

const homepageFields = {
  statusBar: {
    leftLabel: "Hi-Tech Vigilance · Est. 2025",
    liveLabel: "Live Intelligence Feed Active",
    rightLabel: "™ Type 42 · India · hivig.com",
  },
  mainEyebrow: "Hi-Tech Vigilance · Est. 2025",
  heading: { lead: "The", emphasis: "vigilant", middleLine: "voice of", outlineLine: "agentic AI" },
  introduction: [
    {
      _type: "block",
      _key: "homepage-introduction",
      style: "normal",
      markDefs: [],
      children: [
        { _type: "span", _key: "intro-1", text: "The agentic AI space moves fast and talks loudly. Hivig cuts through both. ", marks: [] },
        { _type: "span", _key: "intro-2", text: "Technically rigorous", marks: ["strong"] },
        { _type: "span", _key: "intro-3", text: " enough for engineers and architects. ", marks: [] },
        { _type: "span", _key: "intro-4", text: "Strategically clear", marks: ["strong"] },
        { _type: "span", _key: "intro-5", text: " enough for product managers and executives. Independent enough to tell you the truth about every platform.", marks: [] },
      ],
    },
  ],
  primaryAction: action("Read the Latest Intel →", "/intel", "primary"),
  secondaryAction: action("What Hivig stands for", "/manifesto", "text"),
  eyebrow: "Choose your path · Hi-Tech Vigilance",
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
    { _key: "race", label: "See What's Winning", description: "Live rankings of the AI models actually worth your attention.", href: "/race", accent: "signal" },
    { _key: "agents", label: "Build It Right", description: "Describe the agent you need. Get a real quote, not a demo.", href: "/agents", accent: "verify" },
    { _key: "intel", label: "Know Before You Build", description: "Independent analysis — no vendor hype, ever.", href: "/intel", accent: "amber" },
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
  latestIntel: { heading: "Latest", emphasis: "Intel", archiveLabel: "Full Archive →" },
  manifestoPromotion: {
    eyebrow: "The Hivig Manifesto",
    heading: "The agentic AI space has enough noise. We bring",
    emphasis: "signal.",
    action: action("Read the full manifesto →", "/manifesto", "text"),
  },
  subscribePromotion: {
    eyebrow: "Stay Ahead of the Curve",
    heading: "The agentic AI brief that",
    emphasis: "matters.",
    action: action("Subscribe Free →", "/subscribe", "primary"),
  },
};

try {
  const existing = await client.fetch('*[_id == "homepageHero"][0]._id');
  if (existing) {
    await client.patch("homepageHero").setIfMissing(homepageFields).commit();
    console.log("Added missing CMS fields to the existing Homepage document without overwriting editor content.");
  } else {
    await client.create({ _id: "homepageHero", _type: "homepageHero", ...homepageFields });
    console.log("Created the Homepage singleton with the current website content.");
  }
} catch (error) {
  if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 403) {
    console.error("Homepage could not be seeded: SANITY_API_WRITE_TOKEN must use the Editor role.");
    process.exitCode = 1;
  } else {
    throw error;
  }
}
