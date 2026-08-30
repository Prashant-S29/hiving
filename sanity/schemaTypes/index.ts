import { article } from "./article";
import { homepageHero } from "./homepageHero";
import { aboutPage } from "./documents/aboutPage";
import { agentDiscoverPage, agentPricingPage, agentStorePage } from "./documents/agentPages";
import { compareSettings } from "./documents/compareSettings";
import { consultancyPage } from "./documents/consultancyPage";
import { editorialSettings } from "./documents/editorialSettings";
import { articleType, author, industry, platform } from "./documents/editorialTaxonomy";
import { privacyPage, termsPage } from "./documents/legalPages";
import { manifestoPage } from "./documents/manifestoPage";
import { notFoundPage } from "./documents/notFoundPage";
import { aiModel, benchmarkRecord, organization, sourceCitation } from "./documents/raceData";
import { raceSettings } from "./documents/raceSettings";
import { subscribePage } from "./documents/subscribePage";
import { page } from "./documents/page";
import { siteSettings } from "./documents/siteSettings";
import { callToAction } from "./objects/callToAction";
import { imageWithAlt } from "./objects/imageWithAlt";
import { legalTable } from "./objects/legalTable";
import { link } from "./objects/link";
import { sectionSettings } from "./objects/sectionSettings";
import { seo } from "./objects/seo";
import { ctaSection } from "./objects/sections/ctaSection";
import { heroSection } from "./objects/sections/heroSection";
import { richTextSection } from "./objects/sections/richTextSection";
import { stlTableBlock } from "./objects/stlTableBlock";

export const schemaTypes = [
  // Documents
  aboutPage,
  agentDiscoverPage,
  agentPricingPage,
  agentStorePage,
  aiModel,
  article,
  articleType,
  author,
  benchmarkRecord,
  compareSettings,
  consultancyPage,
  editorialSettings,
  homepageHero,
  manifestoPage,
  industry,
  notFoundPage,
  organization,
  page,
  platform,
  privacyPage,
  raceSettings,
  sourceCitation,
  subscribePage,
  termsPage,
  siteSettings,
  stlTableBlock,

  // Shared objects
  callToAction,
  imageWithAlt,
  legalTable,
  link,
  sectionSettings,
  seo,

  // Page sections
  ctaSection,
  heroSection,
  richTextSection,
];
