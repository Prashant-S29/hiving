# Hivig CMS Migration Plan

> **Status:** Implementation in progress
>
> **CMS decision:** Continue with **Sanity** rather than migrate to Strapi.
>
> **Primary goal:** The client can manage all website content, media, navigation, SEO, and approved presentation options without editing code or requiring a deployment.
>
> **Architecture principle:** Sanity owns content and safe presentation choices. Next.js owns rendering, responsive layout, accessibility, business logic, integrations, security, and the design system.

---

## 1. Purpose

This document is the implementation roadmap for migrating the complete Hivig website from hardcoded content to a client-managed CMS.

The migration is intentionally incremental. Each phase must leave the website deployable and visually stable. Existing pages should not be rewritten in one large change. For every area, we will define its schema, migrate its existing content, connect the frontend, test it, and only then remove the corresponding hardcoded source.

The completed system should allow the client to:

- Edit all editorial and marketing text.
- Manage articles and rich article bodies.
- Upload and replace images, logos, illustrations, and videos.
- Edit page SEO and social-sharing metadata.
- Manage header navigation, footer groups, CTAs, ticker items, statistics, services, legal copy, and shared messages.
- Reorder, show, or hide approved page sections.
- Select safe layout and style variants without entering CSS or code.
- Preview drafts in the context of the real website.
- Publish changes without asking a developer to redeploy the site.
- Manage structured Race data, including models, organizations, benchmarks, and citations.

### Implementation progress — current foundation

Completed in the first implementation slice:

- Shared Sanity `link`, `imageWithAlt`, `seo`, `callToAction`, and `sectionSettings` objects.
- Initial `heroSection`, `richTextSection`, and `ctaSection` page-builder objects.
- `siteSettings` singleton and initial `page` document schema.
- Task-oriented Studio navigation and singleton action protection.
- Sanity Presentation configuration and secure draft-mode enable/disable routes.
- Centralized CMS fetch boundary with draft awareness, Stega support, cache tags, logging, and temporary migration fallbacks.
- Secure webhook revalidation route at `/api/revalidate`.
- CMS-driven global metadata, navigation, brand treatment, footer links, badges, copyright, and tagline.
- Idempotent Site Settings seed script at `scripts/sanity/seed-site-settings.mjs`.
- UnoSend SDK integration for subscriber welcome emails, internal signup notifications, and consultancy enquiry notifications.
- Editorial Settings singleton controlling the Intel archive, category labels, filters, pagination, reading-time labels, empty states, and archive SEO.
- Six existing placeholder articles migrated into Sanity with stable public IDs; three article infographics uploaded to Sanity assets.
- Article link, image alt text, code block, archive, and detail rendering wired through the centralized CMS fetch layer.
- Schema validation, TypeScript checks, and production build passing.

Still required before this slice is operational end-to-end:

- Configure the deployed Sanity webhook using the locally generated `SANITY_REVALIDATE_SECRET`.
- Test UnoSend sender and notification settings described in `.env.local.example`; durable subscriber-list storage remains blocked because UnoSend's live contacts/audiences endpoints currently return 404.
- Test draft preview, publishing, UnoSend delivery, and internal signup notification manually.

The client should **not** be able to accidentally change or break:

- React implementation details.
- Tailwind class names or arbitrary CSS.
- Responsive behavior.
- Accessibility behavior.
- Form/API security and validation rules.
- Pricing formulas.
- AI feasibility logic.
- Race ranking formulas.
- Cookie-consent behavior.
- Secret keys or server integrations.

---

## 2. Why Sanity

The project already contains a functioning Sanity integration:

- Studio is embedded at `/studio`.
- Sanity dependencies are installed.
- Environment-variable handling exists.
- `article` and `homepageHero` schemas exist.
- Article and homepage queries exist.
- Sanity image rendering exists.
- Portable Text rendering exists.
- The homepage, Intel archive, and article pages already query Sanity with mock fallbacks.

Relevant existing files:

- `sanity.config.ts`
- `sanity/env.ts`
- `sanity/schemaTypes/article.ts`
- `sanity/schemaTypes/homepageHero.ts`
- `sanity/schemaTypes/index.ts`
- `lib/sanity/client.ts`
- `lib/sanity/queries.ts`
- `lib/sanity/image.ts`
- `lib/portableTextComponents.tsx`
- `app/studio/[[...tool]]/page.tsx`

Replacing this with Strapi would require rebuilding the schemas and API integration, deploying and maintaining a separate Strapi server, database, media storage, backups, permissions, and preview integration. Since the required outcome is a usable CMS rather than a specific vendor, expanding Sanity is the lower-risk path.

---

## 3. Current-state audit

### 3.1 Already CMS-managed

#### Articles

The current `article` schema supports:

- Title and slug
- Article type
- Industry
- Deck/summary
- Hero image
- Portable Text body
- Author as plain text
- Read time
- Publication date
- Platform tags
- Featured status
- Basic SEO title and description

#### Partial homepage hero

The current `homepageHero` schema supports:

- An eyebrow label
- Animation, image, or video mode
- Hero image/video
- Choice cards
- Choice labels, descriptions, links, and approved accent colors

### 3.2 Not yet CMS-managed

The following content remains hardcoded and must be migrated.

#### Global content

- Root/default SEO metadata in `app/layout.tsx`
- Header logo treatment, navigation, volume label, and Subscribe CTA in `components/Nav.tsx`
- Footer description, badges, link groups, company details, and tagline in `components/Footer.tsx`
- Cookie banner and preference-dialog copy in `components/CookieConsent.tsx`
- Shared form and interface labels
- 404 copy in `app/not-found.tsx`

#### Homepage

- Status strip
- Main headline
- Introductory paragraph
- Main CTAs
- Etymology bar
- Platform ticker in `components/Ticker.tsx`
- Statistics in `components/StatsBar.tsx`
- Latest Intel headings and archive CTA
- Manifesto promotion
- Subscribe promotion

The existing Homepage Hero only controls the interactive/media picker section; it does not control the main page hero.

#### Editorial and marketing pages

- Intel archive introduction and empty states
- About page
- Manifesto page and principles
- Consultancy page and services
- Consultancy enquiry introduction
- Subscribe page
- Privacy policy
- Terms of use

#### Forms and interactive UI

- Subscribe form labels, placeholders, buttons, and result messages
- Enquiry form labels, consent copy, buttons, and result messages
- Agent quote form labels, placeholders, explanatory labels, and messages
- Discover search and generated-result UI labels
- Pagination and filter labels where applicable

#### Race

- Race landing-page copy
- Ranking methodology copy
- Model-page labels and explanatory text
- AI model records currently stored in `data/seed-models.ts`
- Organization/logo data
- Benchmark data and source descriptions
- Market/funding data

#### Agent Store

- Agent Store landing copy
- Pricing explanation
- Regional display labels
- Discover-page copy
- Quote and feasibility result labels

### 3.3 Technical issues to resolve during migration

- CMS fetches are duplicated across pages.
- Queries are untyped at their boundaries.
- Published-content caching and invalidation are not explicitly organized.
- Draft preview and visual editing are not configured.
- CMS errors are swallowed and silently replaced with mock content.
- Production can therefore appear healthy while Sanity is misconfigured or a query is broken.
- The homepage hero query fetches the first matching document rather than the fixed singleton ID.
- Authors, categories, platforms, organizations, and citations are plain strings instead of referenced records.
- Page metadata is mostly hardcoded.
- Some Portable Text typing currently relies on `as any`.

---

## 4. Content ownership rules

### 4.1 Sanity will own

- Marketing and editorial copy
- Headlines, eyebrows, descriptions, disclaimers, and helper text
- CTA labels and destinations
- Navigation and footer content
- Images, video, logos, captions, and alt text
- Page SEO and Open Graph data
- Legal content and effective dates
- Ticker entries and statistics
- Service cards and manifesto principles
- Article content and taxonomy
- AI model facts, organization facts, benchmarks, citations, and editorial commentary
- Form labels, placeholders, help text, consent text, and success/error copy
- Empty-state copy
- Section ordering and visibility
- Approved style variants

### 4.2 Next.js/code will own

- URLs and route implementation
- Section React components
- Responsive grids and breakpoints
- Animation behavior
- Design tokens and accessible contrast
- Functional icons
- Form submission logic
- Input validation and anti-spam controls
- API response status and security behavior
- Email and CRM integrations
- Anthropic integration
- Pricing calculations and regional multiplier logic
- Race ranking calculations
- Structured-data generation logic
- Cookie storage and consent behavior
- Safe fallbacks for unexpected technical failures

### 4.3 Presentation controls exposed to editors

Editors may select controlled values such as:

- Theme: `default`, `surface`, `paper`, `deep`
- Accent: `signal`, `verify`, `amber`
- Alignment: `left`, `center`
- Width: `narrow`, `content`, `full`
- Spacing: `compact`, `normal`, `large`
- Columns: approved values appropriate to a section
- Media position: `left`, `right`, `background`
- Visibility: published/hidden or an explicit `enabled` field

Editors will not enter Tailwind classes, raw CSS, JavaScript, or React code.

### 4.4 Icon policy

- Decorative illustrations and logos may be uploaded to Sanity.
- Functional interface icons remain in code.
- Where editors need icon choice, Sanity exposes an `iconKey` dropdown backed by a frontend icon registry.
- Arbitrary SVG/HTML input will not be accepted.

---

## 5. Target CMS architecture

The target is a **hybrid structured CMS and controlled page builder**.

- Structured documents are used for reusable business/editorial data.
- Reusable section objects are used for page composition.
- Complex interactive features remain fixed React components but can be inserted and configured as page sections.
- Existing routes remain stable for SEO and inbound links.

### 5.1 Suggested schema directory structure

```text
sanity/schemaTypes/
├── documents/
│   ├── siteSettings.ts
│   ├── page.ts
│   ├── article.ts
│   ├── author.ts
│   ├── category.ts
│   ├── platform.ts
│   ├── service.ts
│   ├── organization.ts
│   ├── aiModel.ts
│   ├── benchmarkRecord.ts
│   └── sourceCitation.ts
├── objects/
│   ├── seo.ts
│   ├── link.ts
│   ├── imageWithAlt.ts
│   ├── callToAction.ts
│   ├── sectionSettings.ts
│   ├── formCopy.ts
│   └── sections/
│       ├── heroSection.ts
│       ├── richTextSection.ts
│       ├── splitContentSection.ts
│       ├── cardGridSection.ts
│       ├── statGridSection.ts
│       ├── tickerSection.ts
│       ├── quoteSection.ts
│       ├── ctaSection.ts
│       ├── articleFeedSection.ts
│       ├── serviceGridSection.ts
│       ├── principleGridSection.ts
│       ├── formSection.ts
│       ├── raceLeaderboardSection.ts
│       ├── agentQuoteSection.ts
│       └── discoverSection.ts
└── index.ts
```

The exact split may be adjusted during implementation, but schemas must remain small, named, reusable, and understandable to non-developer editors.

### 5.2 Global `siteSettings` singleton

Proposed fixed document ID: `siteSettings`.

Fields:

- Site/brand name
- Brand mark or logo image
- Logo alt text
- Site URL
- Default language
- Default SEO title
- SEO title template
- Default meta description
- Default Open Graph image
- Organization name
- Copyright template
- Trademark/company lines
- Header navigation links
- Header CTA
- Optional header badge/volume label
- Footer introduction
- Footer badges
- Footer link groups
- Footer tagline
- Social links
- Cookie banner title/body/actions
- Cookie-category labels and descriptions
- Cookie preference-dialog text
- Shared labels, including common back/archive/read-time text where appropriate

Only one document may exist. It should be pinned in Studio navigation and excluded from normal “create new” actions.

### 5.3 `page` document

A page document will represent the editable content for a route while Next.js continues to own the route itself.

Fields:

- Internal editor title
- Route/path
- Page key
- SEO object
- Optional social image override
- Section array
- Optional no-index setting
- Last reviewed date

Initially supported fixed page keys:

- `home`
- `intel`
- `about`
- `manifesto`
- `consultancy`
- `consultancy-enquire`
- `subscribe`
- `privacy`
- `terms`
- `race`
- `race-methodology`
- `agents`
- `agents-pricing`
- `agents-discover`
- `not-found`

Known pages should be created with stable IDs and pinned into logical Studio groups. Editors should not be able to accidentally create duplicate homepage or settings documents.

### 5.4 Reusable section model

Every section should include:

- Stable `_key`
- Internal label for editors
- `enabled` value
- Section-specific content
- Limited `sectionSettings`

Initial section types:

#### Hero

- Eyebrow
- Heading as rich heading content
- Body
- Primary/secondary CTAs
- Image/video
- Media mode
- Approved visual variant

#### Rich text

- Optional heading
- Portable Text body
- Width setting
- Approved background/theme

#### Split content

- Left and right content
- Optional media
- Mobile stacking preference from approved choices

#### Card grid

- Heading/introduction
- Cards containing title, text, icon/media, and link
- Approved column count

#### Statistics

- Value
- Prefix/suffix
- Label
- Optional source or note

#### Ticker

- Repeated labels
- Optional links
- Accent selection

#### Quote

- Quote body
- Attribution
- Citation/source link

#### CTA

- Eyebrow
- Heading
- Body
- Primary/secondary actions
- Background variant

#### Article feed

- Heading
- Archive-link label
- Feed mode such as featured/latest/manual
- Item limit
- Optional manually selected articles

#### Service grid

- Heading and introduction
- Service references or inline cards

#### Principles grid

- Number/eyebrow
- Title
- Description

#### Functional section slots

These insert existing tested React functionality into an editable page:

- Subscribe form
- Enquiry form
- Intel filters/archive
- Race leaderboard
- Agent intake/quote form
- Discover feasibility interface
- Pricing table

Editors can configure surrounding copy and approved options but cannot replace the business logic.

### 5.5 Link object

Links must support:

- Internal page reference where practical
- Internal path fallback for application routes/query strings
- External URL
- Label
- New-tab choice for external links
- Optional accessibility label

A frontend link resolver should produce the final `href`. Validation should prevent a link from containing conflicting internal and external destinations.

### 5.6 Image object

All meaningful images should include:

- Sanity image asset
- Required alt text, with an explicit decorative-image option
- Optional caption
- Optional credit
- Optional source URL
- Hotspot/crop data

Video should include:

- Uploaded asset or approved external URL
- Poster image
- Accessibility description/caption where needed
- Autoplay/mute options limited to safe combinations

### 5.7 SEO object

Fields:

- Meta title
- Meta description
- Open Graph title override
- Open Graph description override
- Open Graph image
- Canonical URL override
- No-index option
- Optional structured-data-specific description

Every route should generate metadata from CMS content with `siteSettings` defaults.

---

## 6. Structured collection design

### 6.1 Articles

Extend the current article schema rather than replacing it abruptly.

Target fields:

- Title
- Slug
- Deck
- Hero image with alt/caption/credit
- Portable Text body
- Author reference
- Article type/category reference
- Industry/category references
- Platform references
- Featured flag and optional feature priority
- Read time
- Published date
- Updated/reviewed date
- Related articles
- Sources/citations where relevant
- SEO object

Migration compatibility:

- Keep existing fields readable while records are migrated.
- Convert plain author strings into author references.
- Convert fixed string tags into taxonomy references.
- Update queries only after content migration succeeds.

### 6.2 Authors

Fields:

- Name
- Slug
- Role/title
- Short biography
- Portrait
- Credentials
- Social/profile links
- Active status

### 6.3 Categories and platforms

Fields:

- Name
- Slug/value
- Description
- Approved accent
- Optional icon/logo
- Sort order
- Active status

This replaces hardcoded user-facing taxonomy labels while keeping frontend visual mappings controlled.

### 6.4 Services

Fields:

- Title
- Slug/internal key
- Short description
- Long description if needed
- Icon key
- CTA
- Sort order
- Active status

### 6.5 Organizations

Fields:

- Name
- Slug
- Country code/name
- Logo with alt text and source/license notes
- Website
- Public/private status
- Exchange/ticker where applicable
- Funding summary
- Funding source reference
- Last reviewed date

### 6.6 AI models

Move model content out of `data/seed-models.ts`.

Fields:

- Model name
- Slug
- Organization reference
- Release date
- Model type
- Model/logo override if required
- Benchmark record references
- Market status derived from organization or overridden when necessary
- Editorial summary
- Source citations
- Previous rank snapshot if the ranking pipeline requires it
- Last reviewed/updated timestamp
- Published/active status

Important boundary:

- Editors manage model facts and source records.
- Code or a backend process computes ranks from the approved methodology.
- A manually entered rank may exist only as a clearly labeled temporary migration field and must not become the permanent methodology.

### 6.7 Benchmarks and citations

`benchmarkRecord` fields:

- Model reference
- Benchmark name
- Score
- Score date
- Source citation reference
- Verification/review status

`sourceCitation` fields:

- Source name
- Source URL
- Publication date
- Accessed date
- Summary/notes
- Source type
- Verification status

No benchmark or financial claim should be publishable without a source once validation is enabled.

---

## 7. Route-by-route migration matrix

| Route/area | Current source | Target CMS ownership | Code retained |
|---|---|---|---|
| Global layout | `app/layout.tsx` | Default SEO, organization metadata, shared settings | Fonts, theme initialization, layout |
| Header | `components/Nav.tsx` | Logo/media, nav labels/links, badge, CTA | Responsive nav and theme toggle |
| Footer | `components/Footer.tsx` | Description, badges, groups, legal/company text, tagline | Responsive footer layout |
| Cookies | `components/CookieConsent.tsx` | All user-facing cookie copy | Consent state and storage behavior |
| `/` | `app/page.tsx` | All copy, media, CTAs, sections, ordering, style variants | Hero animation and section components |
| Homepage ticker | `components/Ticker.tsx` | Items and optional links | Animation behavior |
| Homepage stats | `components/StatsBar.tsx` | Values, suffixes, labels, sources | Grid presentation |
| `/intel` | `app/intel/page.tsx` | SEO, introduction, labels, empty states | Filtering, pagination, article query |
| `/intel/[slug]` | Article schema/page | Article content, labels where shared, SEO | Article rendering and structured data |
| `/about` | `app/about/page.tsx` | Entire page content and SEO | Section rendering |
| `/manifesto` | `app/manifesto/page.tsx` | Entire page, quote, principles, SEO | Section rendering |
| `/consultancy` | `app/consultancy/page.tsx` | Hero, services, CTA, SEO | Layout and service rendering |
| `/consultancy/enquire` | Page + `EnquiryForm` | Intro and form copy | Submission/validation logic |
| `/subscribe` | Page + `SubscribeForm` | Intro, benefit copy, form copy | Submission/validation logic |
| `/legal/privacy` | Hardcoded page | Full rich text, effective date, SEO | Legal-page template |
| `/legal/terms` | Hardcoded page | Full rich text, effective date, SEO | Legal-page template |
| `/race` | Page + seed data | Page copy, labels, structured model data | Rank calculation, RaceTrack UI, JSON-LD generation |
| `/race/models/[slug]` | Seed model data | Model facts, sources, editorial copy | Detail template and JSON-LD generation |
| `/race/methodology` | Hardcoded page/file reference | Published methodology content and status | Methodology template/calculation implementation |
| `/agents` | Hardcoded page/form | Page and form copy | Quote logic and API |
| `/agents/pricing` | Hardcoded page/constants | Explanatory copy and labels | Pricing constants/formula unless separately approved |
| `/agents/discover` | Hardcoded page/UI | Page and result-interface copy | Anthropic/API behavior and result rendering |
| 404 | `app/not-found.tsx` | Heading, body, CTA | 404 behavior |

---

## 8. Frontend integration architecture

### 8.1 Centralized Sanity client and fetch layer

Replace scattered direct `client.fetch` calls with a shared server-side helper.

Target responsibilities:

- Enforce configured project/dataset values in production.
- Select published or draft perspective correctly.
- Attach cache tags.
- Centralize error logging.
- Return typed query results.
- Support preview/visual-editing metadata.
- Make local mock behavior explicit rather than silent.

Suggested frontend structure:

```text
lib/sanity/
├── client.ts
├── fetch.ts
├── queries.ts
├── image.ts
├── links.ts
├── live.ts
├── types.ts (generated or query-derived)
└── validation.ts
```

Queries may later be split by domain if `queries.ts` becomes too large.

### 8.2 Query organization

Use named queries for:

- Site settings
- Page by key/route
- Homepage
- Article archive
- Featured/latest articles
- Article by slug
- Authors/taxonomies
- Race model list
- Race model by slug
- Pricing/page settings

Queries should request only fields required by their component tree.

### 8.3 Type safety

- Define queries using Sanity-compatible typed query tooling where supported by the installed package versions.
- Add schema extraction/type generation as a project script.
- Keep generated files out of hand-edited domain types.
- Validate nullable fields at boundaries.
- Remove avoidable `as any`, including Portable Text usage.
- Treat schema changes and generated type updates as one change.

### 8.4 Section renderer

Create a central renderer, for example:

```text
components/sections/SectionRenderer.tsx
```

Responsibilities:

- Map each Sanity `_type` to one React section component.
- Ignore disabled sections.
- Give every section a stable React key.
- Reject or log unsupported section types in development.
- Apply only approved section settings.
- Preserve accessibility and semantic heading structure.

Section components should remain presentational and receive CMS data as props.

### 8.5 Client-component content

Forms and interactive components currently contain hardcoded text in client components. Server pages should fetch the content and pass a serializable configuration object into those components.

Example concept:

```tsx
<SubscribeForm copy={page.subscribeFormCopy} />
```

Emergency technical messages may retain a code fallback, but the normal client-facing text must come from Sanity.

### 8.6 Metadata

- Convert static metadata exports to `generateMetadata` where CMS data is required.
- Merge page SEO with `siteSettings` defaults.
- Preserve stable canonical URLs.
- Generate article/model structured data from structured CMS records.
- Do not allow editors to paste arbitrary JSON-LD scripts.

---

## 9. Draft preview and visual editing

Configure Sanity Presentation/Visual Editing for the Next.js App Router.

Required behavior:

- Studio displays the website preview.
- Editors can navigate among supported routes.
- Clicking editable content opens the relevant document/field.
- Drafts are visible only when authenticated preview mode is enabled.
- Public traffic receives published content only.
- Preview mode can be securely enabled and disabled.

Implementation tasks:

- [ ] Add required Sanity visual-editing packages using `npm`.
- [ ] Add the Presentation Tool to `sanity.config.ts`.
- [ ] Configure document locations for page, article, and model documents.
- [ ] Add secure draft-mode enable/disable route handlers.
- [ ] Add a read token with minimum required permissions.
- [ ] Configure allowed preview origins for local, preview, and production environments.
- [ ] Render visual-editing overlays only in preview mode.
- [ ] Verify unpublished articles and page changes are not publicly accessible.

Potential environment variables:

```text
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
NEXT_PUBLIC_SANITY_STUDIO_URL=
SANITY_STUDIO_PREVIEW_ORIGIN=
```

Exact names should be finalized during implementation and documented in `.env.local.example` without committing secret values.

---

## 10. Publishing and cache invalidation

Publishing should not require a Vercel redeployment.

Plan:

1. Tag CMS fetches by domain and document.
2. Add a secure Sanity webhook endpoint.
3. Validate webhook signatures/secrets.
4. Revalidate affected tags or paths when documents are created, updated, published, unpublished, or deleted.
5. Keep draft preview uncached or correctly perspective-aware.

Suggested cache tags:

- `sanity:site-settings`
- `sanity:pages`
- `sanity:page:<page-key>`
- `sanity:articles`
- `sanity:article:<slug>`
- `sanity:taxonomies`
- `sanity:race-models`
- `sanity:race-model:<slug>`

Webhook behavior must account for cross-page effects. For example:

- Publishing an article invalidates its detail page, Intel archive, and homepage feeds.
- Updating site settings invalidates the root layout/global content.
- Updating an organization invalidates all model pages that reference it.
- Updating a page invalidates only that route unless its content is reused elsewhere.

---

## 11. Mock and fallback-content policy

Development fixture files:

- `lib/mockArticles.ts`
- `lib/mockHero.ts`
- `lib/content/awsBedrockMultiAgentOrchestrationBody.ts`
- `data/seed-models.ts`

Target policy:

- Mocks may remain available for isolated development or tests.
- Development automatically permits fixture fallback; production does not.
- Production must never silently replace failed CMS requests with mock content.
- Missing optional sections may be omitted safely.
- Missing critical singleton content should produce a logged, diagnosable failure or a minimal clearly defined production fallback.
- Once migrated and verified, seed data should move to migration scripts/fixtures rather than runtime production imports.

Implemented emergency production override:

```text
SANITY_ALLOW_FALLBACKS=false
```

It defaults to strict behavior in production and should only be enabled temporarily during a monitored incident.

---

## 12. Content migration strategy

### 12.1 General process for each page/domain

1. Inventory every user-visible string, image, link, metadata field, and repeated record.
2. Decide whether it belongs to a page, global setting, reusable section, or collection document.
3. Create the Sanity schema and validation.
4. Add Studio structure and previews.
5. Create an idempotent migration/seed script using stable document IDs.
6. Import the existing hardcoded content.
7. Verify imported documents in Studio.
8. Add typed queries.
9. Update the React page/components to consume CMS props.
10. Compare the page visually before and after migration.
11. Test draft preview and publishing.
12. Remove runtime hardcoded content only after verification.

### 12.2 Migration scripts

Create scripts under a clear location such as:

```text
scripts/sanity/
├── seed-site-settings.ts
├── migrate-homepage.ts
├── migrate-pages.ts
├── migrate-articles.ts
├── migrate-race-models.ts
└── verify-content.ts
```

Requirements:

- Use `createOrReplace` or equivalent idempotent behavior for fixed documents.
- Never duplicate documents when rerun.
- Log created, updated, skipped, and failed records.
- Keep credentials in environment variables.
- Do not commit exported production data containing sensitive drafts.
- Support dry-run mode where practical.
- Back up/export the dataset before destructive migrations.

### 12.3 Existing article migration

- Preserve current article slugs and URLs.
- Import mock articles only if approved as real/placeholder CMS content.
- Convert author strings and tags to references in a second safe migration.
- Preserve Portable Text keys where possible.
- Verify hero images and body images separately.

### 12.4 Race model migration

- Import records from `data/seed-models.ts` as illustrative/unverified records.
- Preserve slugs so model URLs do not change.
- Create organization references instead of duplicating organization data.
- Keep benchmark scores null until sourced.
- Preserve placeholder warnings until the real methodology and sources are approved.
- Do not make seed records appear verified merely because they moved into Sanity.

---

## 13. Implementation phases

Each phase ends with a reviewable, deployable checkpoint.

### Phase 0 — Confirm scope and create the content inventory

Deliverables:

- [ ] Confirm all routes in the migration matrix.
- [ ] Confirm whether any planned routes/features are missing.
- [ ] Create a complete user-visible copy/media inventory.
- [ ] Mark each item as global, page, section, collection, functional UI, or code-owned.
- [ ] Confirm editor roles and who can publish.
- [ ] Confirm preview and production domains.
- [ ] Export/backup any existing Sanity content.

Exit criteria:

- No ambiguous content ownership remains for the first implementation phase.

### Phase 1 — CMS foundation

Deliverables:

- [ ] Reorganize schemas into documents and reusable objects.
- [ ] Add common link, image, SEO, CTA, and section-settings objects.
- [ ] Add `siteSettings` singleton.
- [ ] Add `page` documents and stable page keys.
- [ ] Configure Studio singleton restrictions and navigation.
- [ ] Add centralized fetch/query utilities.
- [ ] Establish type generation.
- [x] Establish strict production error/fallback policy with an explicit emergency override.
- [ ] Add draft mode and Presentation Tool.
- [ ] Add cache tags and secure webhook revalidation.
- [ ] Update `.env.local.example` and setup documentation.

Exit criteria:

- A test page can be edited, previewed as a draft, published, and updated publicly without redeployment.

### Phase 2 — Global content

Deliverables:

- [x] Migrate root/default metadata.
- [x] Migrate header navigation, logo configuration, badge, and CTA.
- [x] Migrate footer content and link groups.
- [x] Migrate cookie content.
- [x] Migrate shared labels and accessibility copy where appropriate.
- [x] Pass CMS copy into relevant client components.

Exit criteria:

- Client can update global content once and see it reflected on every affected page.

### Phase 3 — Complete homepage migration

Deliverables:

- [x] Expand/replace the partial `homepageHero` model as planned.
- [x] Migrate status strip.
- [x] Migrate primary headline and introduction.
- [x] Migrate hero CTAs.
- [x] Preserve the coded interactive animation.
- [x] Migrate choice cards/media.
- [x] Migrate etymology content.
- [x] Migrate ticker entries.
- [x] Migrate statistics and optional sources.
- [x] Migrate Latest Intel section settings.
- [x] Migrate Manifesto promo.
- [x] Migrate Subscribe CTA.
- [x] Enable safe ordering, visibility, spacing, and alternate treatments for approved homepage sections.

Exit criteria:

- No marketing/editorial homepage copy or media is hardcoded.
- Homepage remains visually equivalent unless changes are explicitly approved.

### Phase 4 — Editorial system

Deliverables:

- [x] Add authors.
- [x] Add categories/article types.
- [x] Add industries/platforms as structured taxonomies.
- [x] Extend article media, SEO, source, review, and related-article fields.
- [x] Migrate article strings to references without changing slugs.
- [x] Update archive/detail queries.
- [x] Migrate Intel page copy, filters, labels, and empty states.
- [x] Add article/model Presentation locations.
- [ ] Confirm deployed article publishing invalidates homepage and archive caches.

Exit criteria:

- An editor can create, preview, publish, update, unpublish, and categorize an article without code changes.

### Phase 5 — Marketing, company, and legal pages

Deliverables:

- [x] Migrate About.
- [x] Migrate Manifesto.
- [x] Migrate principles and quote blocks.
- [x] Migrate Consultancy.
- [x] Add/migrate Services content.
- [x] Migrate Consultancy Enquiry introduction and form copy.
- [x] Migrate Subscribe page and form copy.
- [x] Migrate Privacy Policy.
- [x] Migrate Terms of Use.
- [x] Migrate 404 copy.
- [ ] Add effective/review dates to legal content.

Exit criteria:

- All standard marketing/company/legal pages are fully editable and previewable.

### Phase 6 — Race structured data

Deliverables:

- [x] Add organization schema.
- [x] Add AI model schema.
- [x] Add benchmark and citation schemas.
- [x] Import seed organizations/models with stable slugs.
- [x] Clearly mark unverified data.
- [x] Replace `SEED_MODELS` page reads with centralized Sanity queries and an explicit migration fallback.
- [x] Migrate Race landing copy and labels.
- [x] Migrate model detail labels/content.
- [x] Migrate ranking methodology page.
- [x] Preserve rank computation in code/backend.
- [x] Update structured data generation.
- [x] Verify model/organization changes revalidate dependent pages.

Exit criteria:

- Editors can manage model facts and sources while ranking logic remains protected and reproducible.

### Phase 7 — Agent Store and interactive copy

Deliverables:

- [x] Migrate Agent Store page content.
- [x] Migrate quote form copy.
- [x] Migrate Pricing page explanatory content and regional labels.
- [x] Migrate Discover page content.
- [x] Migrate feasibility result labels, assumptions/risks headings, and disclaimers.
- [x] Preserve quote calculations and Anthropic integration in code.
- [x] Confirm CMS outages do not compromise API behavior.

Exit criteria:

- Client can edit all product-facing copy without changing pricing or AI logic.

### Phase 8 — Final audit, cleanup, and handoff

Deliverables:

- [ ] Audit every route in desktop and mobile layouts.
- [ ] Audit light and dark themes.
- [x] Search the complete app/component trees for remaining user-visible hardcoded copy.
- [x] Classify retained strings in `CONTENT_OWNERSHIP_AUDIT.md` as technical, functional, or intentionally code-owned.
- [x] Remove production page-level mock imports; retain fixtures only through development-gated dynamic imports.
- [ ] Remove deprecated schema fields after migration confirmation.
- [ ] Verify all internal links and media.
- [ ] Verify alt text and heading structure.
- [ ] Verify draft/public separation.
- [ ] Verify cache invalidation.
- [ ] Verify Studio roles and publishing permissions.
- [ ] Update `README.md` and `HANDOFF.md`.
- [ ] Create a short editor guide.
- [ ] Train the client and record unresolved workflow feedback.

Exit criteria:

- The final definition of done in Section 18 is satisfied.

---

## 14. Studio/editor experience

The Studio structure should prioritize client tasks rather than expose a flat technical schema list.

Proposed navigation:

```text
Website
├── Site Settings
├── Homepage
├── Navigation & Footer
├── Intel Page
├── About
├── Manifesto
├── Consultancy
├── Consultancy Enquiry
├── Subscribe
├── Agent Store
├── Agent Pricing
├── Discover
├── The Race
├── Ranking Methodology
└── Legal
    ├── Privacy Policy
    └── Terms of Use

Editorial
├── Articles
├── Authors
├── Categories
└── Platforms

Race Data
├── AI Models
├── Organizations
├── Benchmarks
└── Sources

Reusable Content
├── Services
└── Shared CTAs (only if actual reuse warrants it)
```

Editor usability requirements:

- Human-readable field titles and descriptions.
- Useful document and section previews.
- Logical field groups/tabs.
- Character limits matching frontend constraints.
- Required fields only where genuinely required.
- Validation for URL formats and conflicting link destinations.
- Warnings for missing alt text, sources, and SEO descriptions.
- Clear labels distinguishing internal editor names from public headings.
- Singleton documents protected from duplication/deletion where practical.
- Initial values for common options.
- Hidden conditional fields when irrelevant to the selected variant.

Avoid creating an oversized “Site Settings” document containing every page string. Content should live near the page or feature where editors expect to find it.

---

## 15. Permissions and governance

Recommended roles:

### Administrator

- Schema/project administration
- User and role management
- Dataset/token/webhook management
- Full content access

### Editor/Publisher

- Create and edit all content
- Publish/unpublish content
- Manage media and taxonomies
- No project/token administration

### Contributor, if needed

- Create/edit assigned article drafts
- Cannot publish
- Limited access to site settings, legal content, pricing copy, and Race data

Governance rules:

- Legal changes require an effective/review date.
- Benchmark and funding claims require citations.
- Destructive migrations require a dataset export.
- Production tokens use minimum necessary permissions.
- Preview tokens must never be exposed beyond intended preview behavior.
- Secrets must not be stored in Sanity content.
- Changes to pricing/ranking algorithms require code review, not CMS publishing.

---

## 16. Testing and quality assurance

### 16.1 Required checks after meaningful code changes

```bash
npm run typecheck
npm run build
```

Run `npm run lint` where supported by the current Next.js configuration. If test tooling is added, include its command in `package.json` and CI.

### 16.2 Schema/content tests

- Required-field validation works.
- Singleton documents cannot be duplicated through normal Studio actions.
- Conditional fields show/hide correctly.
- Invalid links are rejected.
- Image accessibility requirements are enforced.
- Source requirements are enforced for claims where applicable.

### 16.3 Query/integration tests

- Published perspective never returns drafts.
- Draft perspective returns authorized drafts.
- Missing optional fields render safely.
- Unsupported section types fail visibly in development and safely in production.
- Internal references resolve correctly.
- Article feeds update after publishing.
- Organization updates propagate to model pages.

### 16.4 Route QA

For every route:

- Desktop and mobile
- Dark and light theme
- Empty, normal, and long-content states
- Draft and published content
- Images with different aspect ratios
- Internal/external links
- SEO metadata and canonical URL
- Keyboard navigation and focus states
- Semantic headings and alt text

### 16.5 Regression checks for interactive features

- Subscribe submission
- Consultancy enquiry submission
- Agent quote generation
- Discover feasibility generation
- Intel filtering/pagination
- Race display and model links
- Cookie preference persistence
- Theme persistence

CMS migration must not change pricing, AI, consent, or ranking behavior unless separately approved.

---

## 17. Deployment and release strategy

Use incremental releases rather than waiting for the entire migration.

For each phase:

1. Build schemas and migrations locally.
2. Test against a non-production dataset or controlled project state where practical.
3. Back up the target dataset.
4. Deploy schema/Studio changes.
5. Run idempotent migration scripts.
6. Deploy frontend queries/renderers.
7. Verify preview and production.
8. Keep a temporary rollback path until acceptance.
9. Remove deprecated code/fields in a later cleanup deployment.

Rollback principles:

- Preserve old fields until new content has been verified.
- Keep content migration scripts idempotent.
- Avoid changing public slugs during migration.
- Do not combine destructive schema cleanup with the first frontend cutover.
- Record dataset export and deployment references before major migrations.

---

## 18. Final definition of done

The CMS migration is complete only when all of the following are true:

### Content control

- [x] All normal user-facing editorial and marketing text comes from Sanity.
- [ ] All normal page images/video come from Sanity or explicitly approved external media fields.
- [ ] Header, footer, navigation, CTAs, ticker, stats, legal content, and SEO are editable.
- [x] Form labels/help/success copy is editable while form logic remains protected.
- [ ] Articles, authors, categories, platforms, services, organizations, models, benchmarks, and citations are structured records.

### UI control

- [x] Editors can reorder and hide approved homepage sections while the primary hero remains fixed for SEO/accessibility.
- [ ] Editors can choose approved section themes, accents, alignments, and variants.
- [ ] Editors cannot enter arbitrary code or design-breaking class names.
- [ ] Functional UI remains responsive and accessible.

### Publishing workflow

- [ ] Editors can preview drafts on the real frontend.
- [ ] Public users cannot see drafts.
- [ ] Published changes appear without a frontend redeployment.
- [ ] Unpublishing removes content from all relevant routes/feeds.
- [ ] Relevant pages are revalidated when referenced content changes.

### Reliability

- [x] Production does not silently display mock content when CMS requests fail.
- [x] Critical CMS failures are logged and diagnosable.
- [x] Optional missing content degrades safely while required singletons fail explicitly.
- [ ] Type checking and production build pass.
- [ ] Existing forms, pricing, AI generation, Race display, consent, and themes still work.

### Client handoff

- [ ] Client roles and permissions are configured.
- [ ] Studio navigation is task-oriented and understandable.
- [ ] Editing/publishing documentation exists.
- [ ] Dataset backup/export instructions exist.
- [ ] Environment variables and webhook setup are documented.
- [ ] Client has completed an edit-preview-publish exercise successfully.

---

## 19. Risks and mitigations

### Risk: Overly flexible page builder breaks the design

**Mitigation:** Only expose tested sections and approved variants. Never expose raw Tailwind classes, HTML, CSS, or JavaScript.

### Risk: One massive schema becomes difficult for the client

**Mitigation:** Use page-local content, reusable objects, collections, field groups, conditional fields, and task-oriented Studio navigation.

### Risk: Production silently serves stale mock content

**Mitigation:** Remove automatic production mock fallbacks and add explicit error monitoring/logging.

### Risk: Referenced content changes do not update all pages

**Mitigation:** Design cache tags and webhook invalidation around document dependencies, not only direct routes.

### Risk: Schema changes break existing documents

**Mitigation:** Add fields first, migrate content, update frontend reads, verify, and remove deprecated fields only in a later phase.

### Risk: Client changes structured data that should be computed

**Mitigation:** Keep pricing and ranking calculations in code/backend and expose only facts, sources, and explanatory content in CMS.

### Risk: Arbitrary uploaded icons create security or consistency problems

**Mitigation:** Use an approved icon registry; reserve uploads for reviewed media and logos.

### Risk: Visual editing exposes drafts publicly

**Mitigation:** Use secure draft-mode routes, read-only minimum-scope tokens, allowed origins, and explicit published/draft perspectives.

### Risk: Legal/benchmark content is published without review

**Mitigation:** Add required review dates, source validation, permissions, and optional editorial workflows.

---

## 20. Decisions to confirm before implementation

These decisions do not block creation of the roadmap but must be confirmed before their related phases:

- Which Sanity project/dataset is the production source of truth?
- Is a separate staging dataset required?
- Which client users need Administrator, Publisher, or Contributor access?
- Should editors be allowed to add new top-level pages, or only edit known routes initially?
- Which page sections may be reordered, and which must remain fixed for UX/SEO?
- Are pricing constants intentionally code-owned, or should authorized staff eventually manage them through a protected operational system?
- What is the approved ranking methodology and source-review workflow?
- Which existing mock articles/model records should be imported, archived, or discarded?
- Which email/CRM provider will receive Subscribe and Enquiry submissions?
- Is localization/multiple-language support expected in the foreseeable future?

Default recommendation: initially allow editing of known routes and controlled sections only. Add arbitrary new-page creation after the client workflow and routing requirements are proven.

---

## 21. Immediate next milestone

Begin with **Phase 0 and Phase 1**, then use the homepage as the first complete vertical slice.

The first practical implementation sequence is:

1. Finish the content inventory.
2. Add shared Sanity objects and `siteSettings`.
3. Add the page/section schema foundation.
4. Add centralized typed fetching.
5. Configure draft preview and visual editing.
6. Configure webhook revalidation.
7. Migrate global header/footer/SEO.
8. Migrate the entire homepage.
9. Review the editing experience with the client.
10. Apply the approved pattern to the remaining phases.

This proves the full workflow—schema, migration, editing, preview, publishing, frontend rendering, and cache refresh—before repeating it across the rest of the site.
