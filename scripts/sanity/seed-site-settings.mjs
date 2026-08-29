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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN are required."
  );
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const internalLink = (internalPath) => ({ _type: "link", linkType: "internal", internalPath });

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Hivig",
  brand: { primaryText: "Hi", accentText: "vig" },
  navigation: [
    { _key: "intel", label: "Intel", link: internalLink("/intel"), accent: "default" },
    { _key: "compare", label: "Compare", link: internalLink("/compare"), accent: "default" },
    { _key: "about", label: "About", link: internalLink("/about"), accent: "default" },
    { _key: "consultancy", label: "Consultancy", link: internalLink("/consultancy"), accent: "default" },
    { _key: "race", label: "The Race", link: internalLink("/race"), accent: "signal" },
    { _key: "agents", label: "Agent Store", link: internalLink("/agents"), accent: "verify" },
  ],
  headerBadge: "Vol.I · 2026",
  interfaceLabels: {
    homepageAriaLabel: "Hivig homepage",
    switchToLightLabel: "Switch to light mode",
    switchToDarkLabel: "Switch to dark mode",
  },
  headerCta: {
    _type: "callToAction",
    label: "Subscribe",
    link: internalLink("/subscribe"),
    style: "primary",
  },
  footerDescription:
    "Hi-Tech Vigilance for the Agentic Age. Independent intelligence on autonomous AI systems — rigorous, platform-agnostic, and written for the people who build and lead.",
  footerBadges: ["™ Registered", "Type 42", "hivig.com"],
  footerColumns: [
    {
      _key: "editorial",
      title: "Editorial",
      links: [
        { _key: "deep-dives", label: "Deep Dives", link: internalLink("/intel?category=deep-dive") },
        { _key: "how-to", label: "How-To Guides", link: internalLink("/intel?category=how-to") },
        { _key: "watchdog", label: "Watchdog Reports", link: internalLink("/intel?category=watchdog") },
        { _key: "opinion", label: "Opinion", link: internalLink("/intel?category=opinion") },
      ],
    },
    {
      _key: "company",
      title: "Company",
      links: [
        { _key: "about", label: "About Hivig", link: internalLink("/about") },
        { _key: "manifesto", label: "Manifesto", link: internalLink("/manifesto") },
        { _key: "consultancy", label: "Consultancy", link: internalLink("/consultancy") },
        { _key: "subscribe", label: "Subscribe", link: internalLink("/subscribe") },
      ],
    },
    {
      _key: "legal",
      title: "Legal",
      showCookiePreferences: true,
      links: [
        { _key: "privacy", label: "Privacy Policy", link: internalLink("/legal/privacy") },
        { _key: "terms", label: "Terms of Use", link: internalLink("/legal/terms") },
      ],
    },
  ],
  copyrightTemplate: "© {year} Hivig · Naganarai Media Tech Private Limited",
  footerTagline: "Hi-tech intelligence. Human vigilance.",
  cookieConsent: {
    regionAriaLabel: "Cookie consent",
    bannerIntro: "We use cookies to run this site and, if you allow it, to understand how it’s used. Necessary cookies are always on. See our",
    privacyLinkLabel: "Privacy Policy",
    bannerOutro: "for details.",
    manageLabel: "Manage Preferences",
    rejectLabel: "Reject Non-Essential",
    acceptLabel: "Accept All",
    modalTitle: "Cookie Preferences",
    preferencesLinkLabel: "Cookie Preferences",
    closeLabel: "Close",
    saveLabel: "Save Preferences",
    necessary: { title: "Necessary", description: "Required for the site to function (theme preference, session security). Cannot be disabled." },
    analytics: { title: "Analytics", description: "Helps us understand how visitors use the site, so we can improve it. No data is shared with advertisers." },
    functional: { title: "Functional", description: "Enables extra features (e.g. remembering form inputs, embedded content preferences)." },
  },
  defaultSeo: {
    _type: "seo",
    metaTitle: "Hivig — Hi-Tech Vigilance for the Agentic Age",
    metaDescription:
      "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis — no vendor sponsorships, ever.",
    openGraphTitle: "Hivig — Hi-Tech Vigilance for the Agentic Age",
    openGraphDescription:
      "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis.",
    noIndex: false,
  },
};

try {
  const existing = await client.fetch('*[_id == "siteSettings"][0]._id');
  if (existing) {
    const { _id, _type, ...fields } = siteSettings;
    const currentColumns = await client.fetch('*[_id == "siteSettings"][0].footerColumns');
    const needsPreferenceFlag = Array.isArray(currentColumns) && currentColumns.some((column) => column.showCookiePreferences === undefined);
    let patch = client
      .patch("siteSettings")
      .setIfMissing(fields)
      .setIfMissing({ "cookieConsent.preferencesLinkLabel": "Cookie Preferences" });
    if (needsPreferenceFlag) {
      patch = patch.set({
        footerColumns: currentColumns.map((column) => ({
          ...column,
          showCookiePreferences: column.showCookiePreferences ?? column._key === "legal",
        })),
      });
    }
    await patch.commit();
    console.log("Added missing fields to Site Settings without overwriting editor content.");
  } else {
    await client.create(siteSettings);
    console.log("Created the Site Settings singleton.");
  }
} catch (error) {
  if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 403) {
    console.error("Site Settings could not be created: SANITY_API_WRITE_TOKEN must use the Editor role.");
    process.exitCode = 1;
  } else {
    throw error;
  }
}
