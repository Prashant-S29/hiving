# User-facing content ownership audit

Last audited against the complete `app/` and `components/` trees after the Sanity migration.

## CMS-owned normal content

Sanity owns normal public copy for:

- Global metadata, brand, header navigation, header CTA, footer, shared accessibility labels, theme-toggle labels, and cookie consent.
- Homepage hero, picker labels/cards, section order/visibility/spacing/variants, ticker, statistics, Intel feed labels, Manifesto promotion, and Subscribe promotion.
- Intel archive labels, filters, pagination, article content, authors, article types, industries, platforms, citations, related articles, reviewed dates, and SEO.
- About, Manifesto, Consultancy, enquiry, Subscribe, Privacy Policy, Terms of Use, and 404 pages.
- Agent Store, quote form/results, pricing explanation/region labels, and Discover page/result labels.
- The Race landing page, leaderboard labels, model facts, organizations, benchmarks, citations, methodology, verification labels, SEO, and structured-data descriptions.

## Intentionally code-owned strings and values

The remaining strings found in `app/` and `components/` are intentionally not general editorial content:

- API protocol/validation errors, HTTP status behavior, webhook errors, and internal CMS fetch labels. Client forms display CMS-managed fallback copy rather than raw API errors.
- Schema.org type/property names such as `ItemList`, `FAQPage`, `SoftwareApplication`, and `Organization`.
- Stable routes, cache tags, storage keys, request methods, content types, and environment-variable names.
- Dynamic units and formatting tied to code-owned values, including currency symbols, rank markers, hour abbreviations, date formatting, and calculated numbers.
- Functional/decorative symbols such as arrows, rank-delta glyphs, theme icons, separators, and the decorative homepage canvas.
- Sanity Studio metadata and draft/revalidation administration messages.
- Development fixture/default text, which is gated from normal production execution by strict CMS failure handling.

## Safe presentation boundary

Editors can select approved accents, media modes, homepage order, visibility, spacing, and default/alternate treatments. Arbitrary HTML, CSS, Tailwind classes, React, pricing formulas, ranking formulas, API behavior, and security logic remain code-owned.

## Remaining content work

The content architecture is complete, but launch approval still requires counsel-reviewed legal details, sourced Race data and methodology, licensed organization logos, reviewed article citations/content, and confirmed Agent Store pricing constants.
