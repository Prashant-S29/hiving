export const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  siteName,
  brand{
    primaryText,
    accentText,
    "logoUrl": logo.image.asset->url,
    "logoAlt": select(logo.decorative == true => "", logo.alt)
  },
  navigation[]{
    _key,
    label,
    accent,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  headerBadge,
  interfaceLabels,
  headerCta{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  footerDescription,
  footerBadges,
  footerColumns[]{
    _key,
    title,
    showCookiePreferences,
    links[]{
      _key,
      label,
      "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
      "openInNewTab": link.openInNewTab,
      "ariaLabel": link.ariaLabel
    }
  },
  copyrightTemplate,
  footerTagline,
  cookieConsent{
    regionAriaLabel,
    bannerIntro,
    privacyLinkLabel,
    bannerOutro,
    manageLabel,
    rejectLabel,
    acceptLabel,
    modalTitle,
    preferencesLinkLabel,
    closeLabel,
    saveLabel,
    necessary,
    analytics,
    functional
  },
  defaultSeo{
    metaTitle,
    metaDescription,
    openGraphTitle,
    openGraphDescription,
    "openGraphImageUrl": openGraphImage.image.asset->url,
    canonicalUrl,
    noIndex
  }
}`;

const pageSeoProjection = `seo{
  metaTitle,
  metaDescription,
  openGraphTitle,
  openGraphDescription,
  "openGraphImageUrl": openGraphImage.image.asset->url,
  canonicalUrl,
  noIndex
}`;

export const aboutPageQuery = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  eyebrow,
  heading,
  headingEmphasis,
  body,
  ${pageSeoProjection}
}`;

export const manifestoPageQuery = `*[_type == "manifestoPage" && _id == "manifestoPage"][0]{
  eyebrow,
  heading,
  headingEmphasis,
  nameSectionTitle,
  etymology,
  equationWord,
  equationEmphasis,
  equationCaption,
  positionQuote,
  positionAttribution,
  whySectionTitle,
  whyLead,
  whyBody,
  principles,
  ${pageSeoProjection}
}`;

const legalPageProjection = `{
  title,
  lastUpdatedLabel,
  lastUpdatedValue,
  notice,
  body,
  ${pageSeoProjection}
}`;

export const privacyPageQuery = `*[_type == "privacyPage" && _id == "privacyPage"][0]${legalPageProjection}`;
export const termsPageQuery = `*[_type == "termsPage" && _id == "termsPage"][0]${legalPageProjection}`;

export const notFoundPageQuery = `*[_type == "notFoundPage" && _id == "notFoundPage"][0]{
  code,
  heading,
  body,
  primaryAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  secondaryAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  }
}`;

export const raceSettingsQuery = `*[_type == "raceSettings" && _id == "raceSettings"][0]{
  eyebrow,
  heroEyebrow,
  heroHeadingLead,
  heroHeadingEmphasis,
  heroSubhead,
  heroTrackingWeekLabel,
  heroNextUpdateLabel,
  heroLeaderboardLabel,
  heroScoreUnitLabel,
  heroEmptyStateLabel,
  heroDisclaimerButtonLabel,
  heroDisclaimerTitle,
  heroDisclaimerBody,
  heroDisclaimerLinkLabel,
  headingPrefix,
  headingEmphasis,
  headingSuffix,
  definitionTemplate,
  lastUpdatedLabel,
  themeLabel,
  methodologyAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  dateLocale,
  leaderboardAriaLabel,
  tableCaption,
  rankColumnLabel,
  modelColumnLabel,
  organizationColumnLabel,
  countryColumnLabel,
  typeColumnLabel,
  releasedColumnLabel,
  benchmarkColumnLabel,
  newRankLabel,
  footballComingSoonTemplate,
  logoAltTemplate,
  modelNotFoundTitle,
  modelBackAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  modelIntroductionTemplate,
  dataStatusLabel,
  unverifiedStatusLabel,
  reviewStatusLabel,
  verifiedStatusLabel,
  organizationLabel,
  countryLabel,
  modelTypeLabel,
  releaseDateLabel,
  currentRankLabel,
  benchmarkScoreLabel,
  benchmarkUnsourcedLabel,
  marketStatusLabel,
  publicMarketTemplate,
  privateMarketFallback,
  sourcesHeading,
  sourceLinkLabel,
  modelMethodologyLinkLabel,
  modelSeoTitleTemplate,
  modelSeoDescriptionTemplate,
  methodologyBackAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  methodologyHeading,
  methodologyNotice,
  methodologyNeedsHeading,
  methodologyNeeds,
  methodologySourceNote,
  methodologySeo{
    metaTitle,
    metaDescription,
    openGraphTitle,
    openGraphDescription,
    "openGraphImageUrl": openGraphImage.image.asset->url,
    canonicalUrl,
    noIndex
  },
  itemListName,
  itemListDescription,
  highestModelQuestion,
  highestModelAnswerTemplate,
  refreshQuestion,
  refreshAnswer,
  applicationCategory,
  ${pageSeoProjection}
}`;

export const raceModelsQuery = `*[_type == "aiModel" && active != false] | order(releaseDate desc){
  _id,
  _updatedAt,
  name,
  "slug": slug.current,
  releaseDate,
  modelType,
  openrouterId,
  raceScore,
  previousRaceScore,
  tokensProxy,
  downloads,
  scoreUpdatedAt,
  summary,
  reviewedAt,
  verificationStatus,
  seo{
    metaTitle,
    metaDescription,
    openGraphTitle,
    openGraphDescription,
    "openGraphImageUrl": openGraphImage.image.asset->url,
    canonicalUrl,
    noIndex
  },
  organization->{
    _id,
    _updatedAt,
    name,
    "slug": slug.current,
    countryCode,
    website,
    "logoUrl": logo.image.asset->url,
    "logoAlt": select(logo.decorative == true => "", logo.alt),
    logoSourceUrl,
    logoLicenseNotes,
    isPublic,
    exchange,
    ticker,
    fundingSummary,
    fundingSource->{_updatedAt, name, url, publicationDate, accessedDate, sourceType, verificationStatus},
    reviewedAt,
    verificationStatus
  },
  benchmarkRecords[]->{
    _id,
    _updatedAt,
    title,
    benchmarkName,
    score,
    scoreDate,
    notes,
    verificationStatus,
    source->{_updatedAt, name, url, publicationDate, accessedDate, sourceType, verificationStatus}
  },
  sources[]->{_updatedAt, name, url, publicationDate, accessedDate, sourceType, summary, verificationStatus}
}`;

export const agentStorePageQuery = `*[_type == "agentStorePage" && _id == "agentStorePage"][0]{
  eyebrow,
  heading,
  introLead,
  pricingAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  introMiddle,
  discoverAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  introTail,
  formCopy,
  ${pageSeoProjection}
}`;

export const agentPricingPageQuery = `*[_type == "agentPricingPage" && _id == "agentPricingPage"][0]{
  backAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  heading,
  introduction,
  regionalHeading,
  regionColumnLabel,
  multiplierColumnLabel,
  regionLabels,
  multiplierSuffix,
  disclaimer,
  ${pageSeoProjection}
}`;

export const agentDiscoverPageQuery = `*[_type == "agentDiscoverPage" && _id == "agentDiscoverPage"][0]{
  eyebrow,
  heading,
  introduction,
  interfaceCopy,
  ${pageSeoProjection}
}`;

export const consultancyPageQuery = `*[_type == "consultancyPage" && _id == "consultancyPage"][0]{
  eyebrow,
  heading,
  headingEmphasis,
  introduction,
  services,
  ctaHeading,
  ctaBody,
  ctaAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  enquiryEyebrow,
  enquiryHeadingLineOne,
  enquiryHeadingLineTwo,
  enquiryHeadingEmphasis,
  enquiryIntroduction,
  enquiryFormCaption,
  formCopy,
  ${pageSeoProjection},
  enquirySeo{
    metaTitle,
    metaDescription,
    openGraphTitle,
    openGraphDescription,
    "openGraphImageUrl": openGraphImage.image.asset->url,
    canonicalUrl,
    noIndex
  }
}`;

export const subscribePageQuery = `*[_type == "subscribePage" && _id == "subscribePage"][0]{
  eyebrow,
  headingLineOne,
  headingLineTwo,
  headingEmphasis,
  introduction,
  formCaption,
  benefits,
  formCopy,
  ${pageSeoProjection}
}`;

export const editorialSettingsQuery = `*[_type == "editorialSettings" && _id == "editorialSettings"][0]{
  eyebrow,
  heading,
  headingEmphasis,
  introduction,
  "categories": select(
    count(categoryReferences) > 0 => categoryReferences[]->{"value": value, "label": name},
    categories
  ),
  allCategoriesLabel,
  allPlatformsLabel,
  noArticlesMessage,
  noMatchesMessage,
  paginationAriaLabel,
  previousPageLabel,
  nextPageLabel,
  backToArchiveLabel,
  minuteShortLabel,
  minuteReadLabel,
  missingBodyMessage,
  lastReviewedLabel,
  sourcesHeading,
  relatedArticlesHeading,
  seo{
    metaTitle,
    metaDescription,
    openGraphTitle,
    openGraphDescription,
    "openGraphImageUrl": openGraphImage.image.asset->url,
    canonicalUrl,
    noIndex
  }
}`;

const articleCardProjection = `
  _id,
  title,
  slug,
  "tagType": select(tagType._type == "reference" => tagType->value, tagType),
  "industryTag": select(industryTag._type == "reference" => industryTag->value, industryTag),
  deck,
  "heroImage": coalesce(heroMedia.image, heroImage),
  "heroImageAlt": heroMedia.alt,
  "author": select(author._type == "reference" => author->name, author),
  readTimeMinutes,
  publishedAt,
  "platformTags": select(count(platformTags[_type == "reference"]) > 0 => platformTags[]->name, platformTags),
  featured,
  featurePriority,
  reviewedAt
`;

export const allArticlesQuery = `*[_type == "article"] | order(publishedAt desc) {${articleCardProjection}}`;

export const featuredArticlesQuery = `*[_type == "article" && featured == true] | order(featurePriority asc, publishedAt desc)[0...4] {${articleCardProjection}}`;

export const latestArticlesQuery = `*[_type == "article"] | order(publishedAt desc)[0...5] {${articleCardProjection}}`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  ${articleCardProjection},
  body,
  "authorDetails": author->{name, "slug": slug.current, role, biography, "portraitUrl": portrait.image.asset->url, "portraitAlt": select(portrait.decorative == true => "", portrait.alt), credentials},
  sources[]->{name, url, publicationDate, accessedDate, sourceType, summary, verificationStatus},
  relatedArticles[]->{${articleCardProjection}},
  "metaTitle": coalesce(seo.metaTitle, metaTitle),
  "metaDescription": coalesce(seo.metaDescription, metaDescription),
  "openGraphTitle": seo.openGraphTitle,
  "openGraphDescription": seo.openGraphDescription,
  "openGraphImageUrl": seo.openGraphImage.image.asset->url,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex
}`;

export const allSlugsQuery = `*[_type == "article"]{ "slug": slug.current, publishedAt }`;

export const homepageHeroQuery = `*[_type == "homepageHero" && _id == "homepageHero"][0]{
  statusBar,
  mainEyebrow,
  heading,
  introduction,
  primaryAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  secondaryAction{
    label,
    "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
    "openInNewTab": link.openInNewTab,
    "ariaLabel": link.ariaLabel
  },
  "pickerEyebrow": eyebrow,
  choiceEyebrowLabel,
  choiceActionLabel,
  mediaType,
  heroImage,
  "heroVideoUrl": heroVideo.asset->url,
  choices,
  sectionLayout,
  etymology,
  tickerItems,
  stats,
  latestIntel,
  manifestoPromotion{
    eyebrow,
    heading,
    emphasis,
    action{
      label,
      "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
      "openInNewTab": link.openInNewTab,
      "ariaLabel": link.ariaLabel
    }
  },
  subscribePromotion{
    eyebrow,
    heading,
    emphasis,
    action{
      label,
      "href": select(link.linkType == "external" => link.externalUrl, link.internalPath),
      "openInNewTab": link.openInNewTab,
      "ariaLabel": link.ariaLabel
    }
  }
}`;
