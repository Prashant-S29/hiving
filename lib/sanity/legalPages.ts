import { cache as reactCache } from "react";
import type { PortableTextBlock, PortableTextSpan, TypedObject } from "@portabletext/types";
import { fetchCms } from "@/lib/sanity/fetch";
import { notFoundPageQuery, privacyPageQuery, termsPageQuery } from "@/lib/sanity/queries";
import type { PageSeo } from "@/lib/sanity/companyPages";
import type { CmsLink } from "@/lib/sanity/siteSettings";

export interface LegalTableBlock extends TypedObject {
  _type: "legalTable";
  _key: string;
  headers: string[];
  rows: Array<{ _key: string; cells: string[] }>;
}

export interface LegalPageContent {
  title: string;
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  notice: {
    enabled: boolean;
    label: string;
    body: string;
    tone: "warning" | "information";
  };
  body: Array<PortableTextBlock | LegalTableBlock>;
  seo: PageSeo;
}

export interface NotFoundPageContent {
  code: string;
  heading: string;
  body: string;
  primaryAction: CmsLink;
  secondaryAction: CmsLink;
}

const span = (key: string, text: string, marks: string[] = []): PortableTextSpan => ({
  _type: "span",
  _key: key,
  text,
  marks,
});

function richBlock(
  key: string,
  children: PortableTextSpan[],
  options: { style?: "normal" | "h2" | "h3"; listItem?: "bullet"; level?: number } = {}
): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: options.style || "normal",
    markDefs: [],
    children,
    ...(options.listItem ? { listItem: options.listItem, level: options.level || 1 } : {}),
  };
}

const paragraph = (key: string, text: string) => richBlock(key, [span(`${key}-span`, text)]);
const heading = (key: string, text: string) => richBlock(key, [span(`${key}-span`, text)], { style: "h2" });
const strongLead = (key: string, lead: string, text: string) =>
  richBlock(key, [span(`${key}-lead`, lead, ["strong"]), span(`${key}-text`, text)]);
const strongBullet = (key: string, lead: string, text: string) =>
  richBlock(key, [span(`${key}-lead`, lead, ["strong"]), span(`${key}-text`, text)], { listItem: "bullet" });

export const DEFAULT_PRIVACY_PAGE: LegalPageContent = {
  title: "Privacy Policy",
  lastUpdatedLabel: "Last updated:",
  lastUpdatedValue: "[insert date on publish]",
  notice: {
    enabled: true,
    label: "Working draft",
    body: "This is a working draft prepared to guide implementation. It must be reviewed by qualified counsel before Hivig goes live in production.",
    tone: "warning",
  },
  body: [
    paragraph("privacy-intro", "Hivig (“Hivig,” “we,” “us,” or “our”) is operated by Naganarai Media Tech Private Limited. This policy explains what personal data we collect through hivig.com, why, how it is used and protected, and the rights available to you, wherever you are located. It is written to address obligations under India’s Digital Personal Data Protection Act, 2023 (DPDP Act), the EU/UK General Data Protection Regulation (GDPR), and the California Consumer Privacy Act as amended by the CPRA (CCPA/CPRA)."),
    heading("privacy-who-heading", "1. Who we are"),
    paragraph("privacy-who", "Naganarai Media Tech Private Limited, operating Hivig, is the data fiduciary (under DPDP), data controller (under GDPR), and business (under CCPA/CPRA) responsible for the personal data described in this policy."),
    strongLead("privacy-contact", "Contact for privacy matters: ", "[insert grievance officer / privacy contact email — required under the DPDP Act]"),
    heading("privacy-collect-heading", "2. What we collect"),
    {
      _type: "legalTable",
      _key: "privacy-data-table",
      headers: ["Data", "Collected when", "Purpose"],
      rows: [
        { _key: "email", cells: ["Email address", "Subscribing to the Hivig brief / waitlist", "Sending the newsletter and product updates"] },
        { _key: "enquiry", cells: ["Name, email, company, message", "Submitting a consultancy enquiry", "Responding to your enquiry, scoping engagements"] },
        { _key: "contributor", cells: ["Name, credentials, professional affiliation", "Applying as a Verified Expert Contributor", "Editorial vetting, attribution on published content"] },
        { _key: "vendor", cells: ["Company and listing details", "Submitting or claiming a Vendor Profile", "Displaying vendor-submitted factual data, distinct from the independent Hivig Score"] },
        { _key: "usage", cells: ["Usage data (pages viewed, device, browser, approximate location, referrer)", "Automatically, via cookies and analytics", "Understanding site usage, improving content and performance"] },
        { _key: "cookies", cells: ["Cookies and similar technologies", "Automatically, per your cookie preferences", "See Section 6"] },
      ],
    },
    paragraph("privacy-sensitive", "We do not knowingly collect any special category / sensitive personal data (health, biometric, financial account details, etc.) through this site."),
    heading("privacy-basis-heading", "3. Legal basis for processing"),
    strongBullet("privacy-gdpr", "Under GDPR, ", "we rely on: your consent (newsletter sign-up, non-essential cookies), legitimate interest (basic site analytics, responding to enquiries you initiate), and contractual necessity (delivering a consultancy engagement you request)."),
    strongBullet("privacy-dpdp", "Under the DPDP Act, ", "we process personal data on the basis of your consent, given freely, specifically, and through clear affirmative action, or where processing falls under a legitimate use recognized by the Act (for example, you voluntarily providing data to receive a service you requested)."),
    strongBullet("privacy-ccpa", "Under CCPA/CPRA, ", "we disclose the categories above and your rights in Section 5; we do not sell or share personal data for cross-context behavioral advertising."),
    heading("privacy-share-heading", "4. How we share data"),
    paragraph("privacy-no-sale", "We do not sell personal data. We share data only with:"),
    strongBullet("privacy-provider", "Service providers ", "who process data on our behalf under contract (e.g., email delivery platform, hosting and analytics providers such as Vercel), strictly to provide the service."),
    strongBullet("privacy-authorities", "Legal or regulatory authorities, ", "where required by law."),
    strongBullet("privacy-successor", "A successor entity, ", "in the event of a merger, acquisition, or asset sale, subject to the same protections described here."),
    paragraph("privacy-transfers", "Where any service provider processes data outside your country of residence (including transfers from the EU/UK/India to the United States or elsewhere), we rely on appropriate safeguards such as standard contractual clauses or equivalent mechanisms recognized under applicable law."),
    heading("privacy-rights-heading", "5. Your rights"),
    strongLead("privacy-rights-eu", "If you are in the EU/UK (GDPR): ", "you have the right to access, rectify, erase, restrict, or port your data, to object to processing based on legitimate interest, to withdraw consent at any time without affecting prior processing, and to lodge a complaint with your local supervisory authority."),
    strongLead("privacy-rights-in", "If you are in India (DPDP Act): ", "you have the right to access a summary of your personal data and its processing, to correction and erasure, to grievance redressal directly with us, and to nominate another individual to exercise your rights in the event of death or incapacity. You may withdraw consent at any time, as easily as it was given."),
    strongLead("privacy-rights-ca", "If you are a California resident (CCPA/CPRA): ", "you have the right to know what personal data is collected, to request deletion, to correct inaccurate data, to opt out of sale or sharing (we do not sell or share, per Section 4), to limit use of sensitive personal information, and to not be discriminated against for exercising these rights."),
    paragraph("privacy-exercise", "To exercise any of these rights, contact [insert privacy contact email]. We will respond within the timeframe required by applicable law."),
    heading("privacy-cookies-heading", "6. Cookies"),
    paragraph("privacy-cookie-intro", "We use the following categories of cookies:"),
    strongBullet("privacy-cookie-necessary", "Strictly necessary — ", "required for the site to function (e.g., remembering your cookie preferences). Always active."),
    strongBullet("privacy-cookie-analytics", "Analytics — ", "helps us understand aggregate site usage. Active only with your consent."),
    strongBullet("privacy-cookie-functional", "Functional — ", "remembers preferences (e.g., saved filters on Intel or the Race). Active only with your consent."),
    strongBullet("privacy-cookie-marketing", "Marketing — ", "not currently used. If introduced, this policy will be updated and fresh consent requested."),
    paragraph("privacy-cookie-choice", "You can accept, reject, or customize non-essential cookies when you first visit the site, and change your choice at any time via Cookie Preferences in the site footer. See Section 8 for how consent choices are recorded."),
    heading("privacy-retention-heading", "7. Data retention"),
    paragraph("privacy-retention", "We retain personal data only as long as necessary for the purpose it was collected: newsletter contact data until you unsubscribe, enquiry-form data for the duration of the engagement discussion plus a reasonable follow-up period, and contributor/vendor profile data for as long as the profile remains active on the platform. You may request earlier deletion at any time (Section 5)."),
    heading("privacy-consent-heading", "8. How consent is recorded"),
    paragraph("privacy-consent", "When you make a cookie choice, we store that choice (which categories you accepted) together with a timestamp, so we do not re-prompt you on every visit. This choice is re-requested if our cookie categories change materially, or after 12 months, whichever comes first."),
    heading("privacy-security-heading", "9. Security"),
    paragraph("privacy-security", "We apply reasonable technical and organizational measures (encryption in transit, access controls, and vendor due diligence) to protect personal data. No system is completely secure, and we cannot guarantee absolute security."),
    heading("privacy-children-heading", "10. Children’s privacy"),
    paragraph("privacy-children", "Hivig is intended for working professionals and is not directed at children. We do not knowingly collect personal data from anyone under 16. If you believe a child has provided us data, contact us and we will delete it."),
    heading("privacy-changes-heading", "11. Changes to this policy"),
    paragraph("privacy-changes", "We may update this policy as the site and applicable law evolve. Material changes will be reflected by an updated “Last updated” date, and where required, we will seek fresh consent."),
    heading("privacy-contact-heading", "12. Contact"),
    paragraph("privacy-address", "Naganarai Media Tech Private Limited\n[insert registered address]\n[insert grievance officer / privacy contact email]"),
    paragraph("privacy-authority", "If you are in the EU/UK and believe we have not resolved your concern, you may contact your local data protection supervisory authority."),
  ],
  seo: { metaTitle: "Privacy Policy", metaDescription: "How Hivig collects, uses, protects, and manages personal data." },
};

export const DEFAULT_TERMS_PAGE: LegalPageContent = {
  title: "Terms of Use",
  lastUpdatedLabel: "Last updated:",
  lastUpdatedValue: "[insert date on publish]",
  notice: {
    enabled: true,
    label: "Working draft",
    body: "This is a working draft prepared to guide implementation. It must be reviewed by qualified counsel before Hivig goes live in production.",
    tone: "warning",
  },
  body: [
    paragraph("terms-intro", "These Terms of Use (“Terms”) govern your access to and use of hivig.com (the “Site”), operated by Naganarai Media Tech Private Limited (“Hivig,” “we,” “us,” “our”). By using the Site, you agree to these Terms. If you do not agree, please do not use the Site."),
    heading("terms-what-heading", "1. What Hivig is"),
    paragraph("terms-what", "Hivig publishes independent editorial analysis, benchmarks, and scoring (“the Vigilance Standard,” “Hivig Score”) on AI models, agents, and vendors, and separately offers paid consulting services. Editorial content and the Hivig Score are produced independently; no vendor payment is accepted for ranking, placement, or a favorable score, ever."),
    heading("terms-advice-heading", "2. Not professional advice"),
    paragraph("terms-advice", "Content on the Site, including the Hivig Score, benchmarks, comparisons, the ROI Calculator, AI Readiness Assessment, Model Selector, and all editorial analysis, is provided for general informational purposes only. It does not constitute legal, financial, security, or professional advice, and should not be relied upon as the sole basis for a business, technical, or investment decision. Paid consulting engagements are governed by a separate, signed statement of work, not by these Terms."),
    heading("terms-accuracy-heading", "3. Accuracy and no warranty"),
    paragraph("terms-accuracy", "We test guides before publishing and apply a documented methodology to every score, but the agentic AI landscape changes quickly, and vendor platforms change without notice. Content may become outdated between reviews. The Site and its content are provided “as is” and “as available,” without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose."),
    heading("terms-third-party-heading", "4. Vendor-submitted and contributor content"),
    paragraph("terms-third-party-intro", "Some content on the Site is submitted by third parties:"),
    strongBullet("terms-vendors", "Vendor-Submitted Profiles ", "contain factual listing data claimed and updated directly by the vendor. This data is clearly labeled as vendor-submitted and is not independently verified in the same way as a Hivig Score. The Hivig Score on the same page is always produced independently and is never editable by the vendor."),
    strongBullet("terms-contributors", "Verified Expert Contributors ", "submit verdicts and case studies under their own name and credentials, subject to Hivig editorial review before publishing."),
    strongBullet("terms-community", "Community Signals ", "(ratings and reviews) reflect the views of individual practitioners, not Hivig’s own verdict."),
    paragraph("terms-moderation", "We reserve the right to review, edit, decline, or remove any third-party submission at our discretion, and are not responsible for the accuracy of vendor-submitted or community-submitted content."),
    heading("terms-use-heading", "5. Acceptable use"),
    paragraph("terms-use", "You agree not to: misrepresent your identity or affiliation when submitting content (including vendor or contributor profiles); scrape, systematically extract, or republish Site content without permission; attempt to manipulate the Vigilance Standard, benchmarks, or Community Signals; or use the Site for any unlawful purpose."),
    heading("terms-ip-heading", "6. Intellectual property"),
    paragraph("terms-ip", "The Hivig name, logo, “the Vigilance Standard,” the Hivig Score methodology, and all editorial content are the property of Naganarai Media Tech Private Limited, except where explicitly attributed to a third-party contributor. You may share links to and quote brief excerpts of Site content with attribution; you may not republish substantial portions without our written permission."),
    heading("terms-links-heading", "7. Third-party links"),
    paragraph("terms-links", "The Site links to third-party vendor websites, tools, and platforms for reference. We do not control and are not responsible for the content, policies, or practices of any third-party site."),
    heading("terms-liability-heading", "8. Limitation of liability"),
    paragraph("terms-liability", "To the maximum extent permitted by applicable law, Naganarai Media Tech Private Limited and its officers, employees, and contributors are not liable for any indirect, incidental, consequential, or special damages arising from your use of, or reliance on, the Site or its content. Nothing in these Terms limits liability where such limitation is not permitted by applicable law, including certain consumer-protection provisions that may apply in your jurisdiction."),
    heading("terms-changes-heading", "9. Changes to the Site and these Terms"),
    paragraph("terms-changes", "We may modify, suspend, or discontinue any part of the Site, and may update these Terms from time to time. Continued use of the Site after changes take effect constitutes acceptance of the updated Terms."),
    heading("terms-law-heading", "10. Governing law"),
    paragraph("terms-law", "These Terms are governed by the laws of India, without regard to conflict-of-law principles, and any dispute will be subject to the exclusive jurisdiction of the courts of Jaipur, Rajasthan, India, except where mandatory local consumer-protection law provides otherwise for users located elsewhere."),
    heading("terms-contact-heading", "11. Contact"),
    paragraph("terms-contact", "Naganarai Media Tech Private Limited\n[insert registered address]\n[insert contact email]"),
  ],
  seo: { metaTitle: "Terms of Use", metaDescription: "Terms governing access to and use of the Hivig website and its content." },
};

export const DEFAULT_NOT_FOUND_PAGE: NotFoundPageContent = {
  code: "404",
  heading: "This page doesn’t exist.",
  body: "It may have moved, or it might be a page Hivig hasn’t published yet.",
  primaryAction: { label: "Go Home", href: "/" },
  secondaryAction: { label: "Read Intel", href: "/intel" },
};

type PartialLegal = Partial<Omit<LegalPageContent, "notice" | "seo">> & {
  notice?: Partial<LegalPageContent["notice"]>;
  seo?: Partial<PageSeo>;
};
type PartialNotFound = Partial<NotFoundPageContent>;
const cachePage = typeof reactCache === "function" ? reactCache : <T>(loader: () => Promise<T>) => loader;

async function loadLegal(query: string, fallback: LegalPageContent, label: string, tag: string) {
  const value = await fetchCms<PartialLegal | null>({ query, fallback: null, label, tags: [tag], required: true });
  if (!value) return fallback;
  return {
    ...fallback,
    ...value,
    body: value.body?.length ? value.body : fallback.body,
    notice: { ...fallback.notice, ...value.notice },
    seo: { ...fallback.seo, ...value.seo },
  };
}

export const getPrivacyPage = cachePage(() =>
  loadLegal(privacyPageQuery, DEFAULT_PRIVACY_PAGE, "Privacy Policy", "sanity:page:privacy")
);
export const getTermsPage = cachePage(() =>
  loadLegal(termsPageQuery, DEFAULT_TERMS_PAGE, "Terms of Use", "sanity:page:terms")
);
export const getNotFoundPage = cachePage(async (): Promise<NotFoundPageContent> => {
  const value = await fetchCms<PartialNotFound | null>({
    query: notFoundPageQuery,
    fallback: null,
    label: "Not Found page",
    tags: ["sanity:page:not-found"],
    required: true,
  });
  if (!value) return DEFAULT_NOT_FOUND_PAGE;
  return {
    ...DEFAULT_NOT_FOUND_PAGE,
    ...value,
    primaryAction: { ...DEFAULT_NOT_FOUND_PAGE.primaryAction, ...value.primaryAction },
    secondaryAction: { ...DEFAULT_NOT_FOUND_PAGE.secondaryAction, ...value.secondaryAction },
  };
});
