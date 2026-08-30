import { cache } from "react";
import { fetchCms } from "@/lib/sanity/fetch";
import { siteSettingsQuery } from "@/lib/sanity/queries";

export type CmsAccent = "default" | "signal" | "verify" | "amber";

export interface CmsLink {
  _key?: string;
  label: string;
  href: string;
  openInNewTab?: boolean;
  ariaLabel?: string;
  accent?: CmsAccent;
}

export interface SiteSettings {
  siteName: string;
  brand: {
    primaryText: string;
    accentText: string;
    logoUrl?: string;
    logoAlt?: string;
  };
  navigation: CmsLink[];
  headerBadge?: string;
  headerCta: CmsLink;
  interfaceLabels: {
    homepageAriaLabel: string;
    switchToLightLabel: string;
    switchToDarkLabel: string;
  };
  footerDescription: string;
  footerBadges: string[];
  footerColumns: Array<{
    _key?: string;
    title: string;
    showCookiePreferences?: boolean;
    links: CmsLink[];
  }>;
  copyrightTemplate: string;
  footerTagline: string;
  cookieConsent: {
    regionAriaLabel: string;
    bannerIntro: string;
    privacyLinkLabel: string;
    bannerOutro: string;
    manageLabel: string;
    rejectLabel: string;
    acceptLabel: string;
    modalTitle: string;
    preferencesLinkLabel: string;
    closeLabel: string;
    saveLabel: string;
    necessary: { title: string; description: string };
    analytics: { title: string; description: string };
    functional: { title: string; description: string };
  };
  defaultSeo: {
    metaTitle: string;
    metaDescription: string;
    openGraphTitle: string;
    openGraphDescription: string;
    openGraphImageUrl?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Hivig",
  brand: { primaryText: "Hi", accentText: "vig" },
  navigation: [
    { label: "Intel", href: "/intel", accent: "default" },
    { label: "Compare", href: "/compare", accent: "default" },
    { label: "About", href: "/about", accent: "default" },
    { label: "Consultancy", href: "/consultancy", accent: "default" },
    { label: "The Race", href: "/race", accent: "signal" },
    { label: "Agent Store", href: "/agents", accent: "verify" },
  ],
  headerBadge: "Vol.I · 2026",
  headerCta: { label: "Subscribe", href: "/subscribe", accent: "signal" },
  interfaceLabels: {
    homepageAriaLabel: "Hivig homepage",
    switchToLightLabel: "Switch to light mode",
    switchToDarkLabel: "Switch to dark mode",
  },
  footerDescription:
    "Hi-Tech Vigilance for the Agentic Age. Independent intelligence on autonomous AI systems — rigorous, platform-agnostic, and written for the people who build and lead.",
  footerBadges: ["™ Registered", "Type 42", "hivig.com"],
  footerColumns: [
    {
      title: "Editorial",
      links: [
        { label: "Deep Dives", href: "/intel?category=deep-dive" },
        { label: "How-To Guides", href: "/intel?category=how-to" },
        { label: "Watchdog Reports", href: "/intel?category=watchdog" },
        { label: "Opinion", href: "/intel?category=opinion" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Hivig", href: "/about" },
        { label: "Manifesto", href: "/manifesto" },
        { label: "Consultancy", href: "/consultancy" },
        { label: "Subscribe", href: "/subscribe" },
      ],
    },
    {
      title: "Legal",
      showCookiePreferences: true,
      links: [
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Terms of Use", href: "/legal/terms" },
      ],
    },
  ],
  copyrightTemplate: "© {year} Hivig · Naganarai Media Tech Private Limited",
  footerTagline: "Hi-tech intelligence. Human vigilance.",
  cookieConsent: {
    regionAriaLabel: "Cookie consent",
    bannerIntro:
      "We use cookies to run this site and, if you allow it, to understand how it’s used. Necessary cookies are always on. See our",
    privacyLinkLabel: "Privacy Policy",
    bannerOutro: "for details.",
    manageLabel: "Manage Preferences",
    rejectLabel: "Reject Non-Essential",
    acceptLabel: "Accept All",
    modalTitle: "Cookie Preferences",
    preferencesLinkLabel: "Cookie Preferences",
    closeLabel: "Close",
    saveLabel: "Save Preferences",
    necessary: {
      title: "Necessary",
      description: "Required for the site to function (theme preference, session security). Cannot be disabled.",
    },
    analytics: {
      title: "Analytics",
      description:
        "Helps us understand how visitors use the site, so we can improve it. No data is shared with advertisers.",
    },
    functional: {
      title: "Functional",
      description: "Enables extra features (e.g. remembering form inputs, embedded content preferences).",
    },
  },
  defaultSeo: {
    metaTitle: "Hivig — Hi-Tech Vigilance for the Agentic Age",
    metaDescription:
      "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis — no vendor sponsorships, ever.",
    openGraphTitle: "Hivig — Hi-Tech Vigilance for the Agentic Age",
    openGraphDescription:
      "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis.",
  },
};

type PartialSiteSettings = Partial<Omit<SiteSettings, "brand" | "interfaceLabels" | "cookieConsent" | "defaultSeo">> & {
  brand?: Partial<SiteSettings["brand"]>;
  interfaceLabels?: Partial<SiteSettings["interfaceLabels"]>;
  cookieConsent?: Partial<SiteSettings["cookieConsent"]>;
  defaultSeo?: Partial<SiteSettings["defaultSeo"]>;
};

function withDefaults(value: PartialSiteSettings | null): SiteSettings {
  if (!value) return DEFAULT_SITE_SETTINGS;

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...value,
    brand: { ...DEFAULT_SITE_SETTINGS.brand, ...value.brand },
    navigation: value.navigation?.length ? value.navigation : DEFAULT_SITE_SETTINGS.navigation,
    headerCta: value.headerCta?.href ? value.headerCta : DEFAULT_SITE_SETTINGS.headerCta,
    interfaceLabels: { ...DEFAULT_SITE_SETTINGS.interfaceLabels, ...value.interfaceLabels },
    footerBadges: value.footerBadges?.length ? value.footerBadges : DEFAULT_SITE_SETTINGS.footerBadges,
    footerColumns: value.footerColumns?.length ? value.footerColumns : DEFAULT_SITE_SETTINGS.footerColumns,
    cookieConsent: {
      ...DEFAULT_SITE_SETTINGS.cookieConsent,
      ...value.cookieConsent,
      necessary: { ...DEFAULT_SITE_SETTINGS.cookieConsent.necessary, ...value.cookieConsent?.necessary },
      analytics: { ...DEFAULT_SITE_SETTINGS.cookieConsent.analytics, ...value.cookieConsent?.analytics },
      functional: { ...DEFAULT_SITE_SETTINGS.cookieConsent.functional, ...value.cookieConsent?.functional },
    },
    defaultSeo: { ...DEFAULT_SITE_SETTINGS.defaultSeo, ...value.defaultSeo },
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await fetchCms<PartialSiteSettings | null>({
    query: siteSettingsQuery,
    fallback: null,
    label: "site settings",
    tags: ["sanity:site-settings"],
    required: true,
  });

  return withDefaults(settings);
});
