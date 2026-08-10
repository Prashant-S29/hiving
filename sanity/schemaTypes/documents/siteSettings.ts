import { defineArrayMember, defineField, defineType } from "sanity";

const internalLink = (path: string) => ({
  _type: "link",
  linkType: "internal",
  internalPath: path,
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "header", title: "Header" },
    { name: "footer", title: "Footer" },
    { name: "interface", title: "Shared Interface" },
    { name: "cookies", title: "Cookie Consent" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      group: "identity",
      initialValue: "Hivig",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand mark",
      type: "object",
      group: "identity",
      fields: [
        defineField({ name: "primaryText", title: "Primary text", type: "string", initialValue: "Hi" }),
        defineField({ name: "accentText", title: "Accent text", type: "string", initialValue: "vig" }),
        defineField({
          name: "logo",
          title: "Uploaded logo override",
          type: "imageWithAlt",
          description: "Optional. When empty, the text brand mark is used.",
        }),
      ],
    }),
    defineField({
      name: "navigation",
      title: "Header navigation",
      type: "array",
      group: "header",
      of: [
        defineArrayMember({
          type: "object",
          name: "navigationItem",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "link", title: "Destination", type: "link", validation: (Rule) => Rule.required() }),
            defineField({
              name: "accent",
              title: "Accent",
              type: "string",
              options: { list: ["default", "signal", "verify", "amber"] },
              initialValue: "default",
            }),
          ],
          preview: { select: { title: "label", subtitle: "link.internalPath" } },
        }),
      ],
      initialValue: [
        { _key: "intel", label: "Intel", link: internalLink("/intel"), accent: "default" },
        { _key: "manifesto", label: "Manifesto", link: internalLink("/manifesto"), accent: "default" },
        { _key: "about", label: "About", link: internalLink("/about"), accent: "default" },
        { _key: "consultancy", label: "Consultancy", link: internalLink("/consultancy"), accent: "default" },
        { _key: "race", label: "The Race", link: internalLink("/race"), accent: "signal" },
        { _key: "agents", label: "Agent Store", link: internalLink("/agents"), accent: "verify" },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "headerBadge",
      title: "Header badge",
      type: "string",
      group: "header",
      initialValue: "Vol.I · 2026",
    }),
    defineField({
      name: "headerCta",
      title: "Header call to action",
      type: "callToAction",
      group: "header",
      initialValue: {
        label: "Subscribe",
        link: internalLink("/subscribe"),
        style: "primary",
      },
    }),
    defineField({
      name: "interfaceLabels",
      title: "Shared accessibility and interface labels",
      type: "object",
      group: "interface",
      fields: [
        defineField({ name: "homepageAriaLabel", title: "Homepage link accessibility label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "switchToLightLabel", title: "Switch-to-light-theme label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "switchToDarkLabel", title: "Switch-to-dark-theme label", type: "string", validation: (Rule) => Rule.required() }),
      ],
      initialValue: {
        homepageAriaLabel: "Hivig homepage",
        switchToLightLabel: "Switch to light mode",
        switchToDarkLabel: "Switch to dark mode",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerDescription",
      title: "Footer description",
      type: "text",
      rows: 5,
      group: "footer",
      initialValue:
        "Hi-Tech Vigilance for the Agentic Age. Independent intelligence on autonomous AI systems — rigorous, platform-agnostic, and written for the people who build and lead.",
    }),
    defineField({
      name: "footerBadges",
      title: "Footer badges",
      type: "array",
      group: "footer",
      of: [{ type: "string" }],
      initialValue: ["™ Registered", "Type 42", "hivig.com"],
    }),
    defineField({
      name: "footerColumns",
      title: "Footer link groups",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "showCookiePreferences", title: "Show Cookie Preferences action", type: "boolean", initialValue: false }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "labelledLink",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
                    defineField({ name: "link", title: "Destination", type: "link", validation: (Rule) => Rule.required() }),
                  ],
                  preview: { select: { title: "label", subtitle: "link.internalPath" } },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      initialValue: [
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
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "copyrightTemplate",
      title: "Copyright line",
      type: "string",
      description: "Use {year} where the current year should appear.",
      group: "footer",
      initialValue: "© {year} Hivig · Naganarai Media Tech Private Limited",
    }),
    defineField({
      name: "footerTagline",
      title: "Footer tagline",
      type: "string",
      group: "footer",
      initialValue: "Hi-tech intelligence. Human vigilance.",
    }),
    defineField({
      name: "cookieConsent",
      title: "Cookie consent copy",
      type: "object",
      group: "cookies",
      fields: [
        defineField({ name: "regionAriaLabel", title: "Banner accessibility label", type: "string", initialValue: "Cookie consent" }),
        defineField({ name: "bannerIntro", title: "Banner text before privacy link", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
        defineField({ name: "privacyLinkLabel", title: "Privacy link label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "bannerOutro", title: "Banner text after privacy link", type: "string" }),
        defineField({ name: "manageLabel", title: "Manage button", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "rejectLabel", title: "Reject button", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "acceptLabel", title: "Accept button", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "modalTitle", title: "Preferences title", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "preferencesLinkLabel", title: "Footer preferences link", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "closeLabel", title: "Close accessibility label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "saveLabel", title: "Save button", type: "string", validation: (Rule) => Rule.required() }),
        defineField({
          name: "necessary",
          title: "Necessary category",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
        }),
        defineField({
          name: "analytics",
          title: "Analytics category",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
        }),
        defineField({
          name: "functional",
          title: "Functional category",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
      initialValue: {
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
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO and social sharing",
      type: "seo",
      group: "seo",
      initialValue: {
        metaTitle: "Hivig — Hi-Tech Vigilance for the Agentic Age",
        metaDescription:
          "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis — no vendor sponsorships, ever.",
        openGraphTitle: "Hivig — Hi-Tech Vigilance for the Agentic Age",
        openGraphDescription:
          "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis.",
      },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings", subtitle: "Header, footer, identity and default SEO" }),
  },
});
