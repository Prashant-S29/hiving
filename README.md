# Hivig — Web Platform

Hi-Tech Vigilance for the Agentic Age. This is the Next.js + Sanity codebase
for hivig.com, scoped to the Phase 1 MVP: a content publishing platform
(Intel), the Manifesto, About, Subscribe, a Consultancy teaser, and the
supporting legal pages.

This README is written for a non-developer to follow step by step. Every
command below is meant to be copy-pasted exactly as written.

---

## What's in this MVP (and what isn't, on purpose)

**In scope:** Home, Intel (article index + article template), Manifesto,
About, Subscribe, Consultancy (single teaser page), Legal pages, and the
Sanity Studio CMS embedded at `/studio`. 

**Deliberately out of scope for this MVP**, per the phased roadmap: the 
Industry Hub, Business Problem Hub, Workflow Library, Model Intelligence,
Agent Registry, Vendor Intelligence, Tools, Contributor Network, and
Comparisons. These come in Phase 2 once the content base and contributor
network are real. Building them now, empty, would undercut the trust this
platform is meant to establish.

---

## Step 1 — Local setup

You need [Node.js](https://nodejs.org) version 18 or higher installed.
Check with:

```
node -v
```

Then, inside this folder:

```
npm install
```

This will take a couple of minutes the first time.

---

## Step 2 — Create your Sanity project (the CMS)

Sanity is free for a single-user project at this scale. Run:

```
npx create-sanity@latest --project-plan free
```

When it asks questions, choose: create a new project, name it "Hivig",
use the **production** dataset, and when it asks about a template, choose
**"Clean project with no predefined schemas"** — this project already has
the Article schema built in under `sanity/schemaTypes`.

This command will print a **Project ID**. Copy it.

---

## Step 3 — Set your environment variables

Copy the example file:

```
cp .env.local.example .env.local
```

Open `.env.local` and paste in your Sanity Project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

---

## Step 4 — Run it locally

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the full
site rendering with sample placeholder articles, so it looks complete even
before you've published anything real.

Open [http://localhost:3000/studio](http://localhost:3000/studio) — this is
your content editor. Log in with the same account you used to create the
Sanity project. This is where you and anyone on your team will write and
publish articles.

The moment you publish a real article in the Studio, it replaces the
placeholder content on the live site automatically — no code changes
needed.

---

## Step 5 — Deploy to Vercel

Push this folder to a GitHub repository, then:

1. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
2. Add the production environment variables from `.env.local.example`. At a
   minimum this includes the three `NEXT_PUBLIC_SANITY_*` values,
   `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, the UnoSend variables,
   and `SANITY_STUDIO_PREVIEW_ORIGIN=https://hivig.com`. Keep tokens server-only.
3. Click Deploy.
4. In Sanity Manage → Settings → API → CORS Origins, add
   `https://hivig.com` with credentials enabled. Add the chosen Vercel preview
   origin too if editors will preview that deployment.
5. Add a signed Sanity webhook targeting `https://hivig.com/api/revalidate`,
   use the same `SANITY_REVALIDATE_SECRET` configured in Vercel, and send this
   projection for create/update/delete events:

   ```groq
   {"_id": _id, "_type": _type, "slug": slug.current, "pageKey": pageKey}
   ```

The webhook signature rejection and article cache-tag response have been tested
locally; the deployed webhook still needs a publish/unpublish smoke test.

The deployed editor is available at `https://hivig.com/studio`; only invited
Sanity project members can sign in. Public Hivig navigation, footer, cursor,
and cookie UI are intentionally omitted from every `/studio` route.

Vercel will give you a `.vercel.app` URL first. Once that works correctly,
go to your Vercel project's Domains settings and add **hivig.com**. Vercel
will give you DNS records (usually an A record and a CNAME) — add those at
your domain registrar, wherever hivig.com is currently registered. DNS
changes can take anywhere from a few minutes to a few hours to propagate.

---

## Step 6 — Publish your launch articles

Aim for eight to twelve articles live before announcing publicly, so the
site has real substance on day one. Use the Studio at `/studio` to write
them. Every article needs: a title, a slug, an article type (Deep Dive,
How-To, Watchdog, Opinion, or Fact-Checked), an industry tag, a one or two
sentence deck, the body content, an author, an estimated read time, and a
publish date. Mark up to four articles as "Featured" so they appear in the
homepage's lead section.

Authors, article types, industries, platforms, and reusable citations are
managed under `/studio` → **Editorial**. Articles reference those records, so
renaming a platform or updating an author is reflected wherever it is used.
Article pages also support accessible hero media, reviewed dates, sources,
related articles, complete social metadata, and per-article Presentation
locations. To normalize the original six migrated articles in a new dataset:

```bash
npm run sanity:migrate:editorial
```

This migration preserves every article slug and is safe to rerun.

---

## Editing the homepage (no code, no developer)

Go to `/studio` → **Website → Homepage**. It is a protected singleton, so a
second homepage cannot be created accidentally. The CMS controls:

- Status-bar labels and live-feed text.
- Main eyebrow, structured headline, introduction, and both hero actions.
- Interactive picker label, media mode, uploaded image/video, and choice cards.
- Etymology items.
- Platform ticker entries.
- Homepage statistics.
- Latest Intel section labels.
- Manifesto and Subscribe promotional content and actions.
- Drag-and-drop ordering, visibility, compact/normal/large spacing, and approved
  default/alternate treatments for Ticker, Statistics, Latest Intel, Manifesto,
  and Subscribe sections.

The main hero remains fixed at the top to preserve heading structure, SEO, and
accessibility. Editors cannot add arbitrary sections, CSS, or class names. The
picker can use the built-in interactive animation, an image, or a video.
Choice cards support approved `signal`, `verify`, and `amber` accents. Publish
a change to make it available to the website; authenticated draft preview is
available through Sanity Presentation when `SANITY_API_READ_TOKEN` is set.

The particle/constellation motion, responsive layout, typography, and safe
visual treatments remain code-owned. Everything they display is CMS-owned.
Development fixtures remain available when running locally, but production
throws a logged, diagnosable error if Sanity is missing or a required singleton
is unpublished. `SANITY_ALLOW_FALLBACKS=true` is an emergency-only production
override and should normally remain `false`.

## Editing About and Manifesto

Go to `/studio` → **Website → About** or **Website → Manifesto**. About exposes
its heading, rich page body, and SEO. Manifesto exposes the hero, name
etymology, editorial-position quote, explanatory content, principles, and SEO.
Both are protected singleton documents and retain their bespoke frontend
layouts.

## Editing the Agent Store

Go to `/studio` → **Website → Agent Store**. The three protected documents
manage the Store and quote form, pricing explanation and regional display
labels, and Discover page/result interface. Pricing multipliers, quote
calculations, request validation, and AI behavior remain protected in code.
After a new setup, seed the existing content with:

```bash
npm run sanity:seed:agent-pages
```

Live Discover generation still requires `ANTHROPIC_API_KEY`.

## Editing The Race

Use `/studio` → **Website → The Race** for leaderboard, model-page,
methodology, interface-label, structured-data, and SEO copy. Structured records
are under **Race Data → AI Models / Organizations / Benchmarks / Sources**.
Ranks are deliberately computed in code from the documented placeholder
release-date method; editors cannot enter a current rank. Benchmark scores and
funding claims are rejected unless their required source fields are present.

For a new dataset, migrate the illustrative records with:

```bash
npm run sanity:migrate:race
```

The migration creates 16 organizations, 18 models, and 18 unscored benchmark
records with stable public slugs. Every imported record remains marked
**Unverified / illustrative**. It creates no source citations because the seed
file contains no defensible source URLs; add and review real sources before
publishing claims or treating rankings as authoritative.

## Editing legal and system pages

Go to `/studio` → **Website → Legal** to edit Privacy Policy and Terms of Use.
Both support rich text, lists, links, review notices, SEO, last-updated values,
and structured tables. The seeded documents intentionally retain a visible
working-draft warning and placeholder contact/date fields; qualified counsel
must review and replace these before launch. The editable 404 page is under
**Website → Not Found (404)**. The footer Cookie Preferences label is managed
under **Website → Site Settings → Cookie Consent**.

## Light / dark mode

There's a toggle (☾ / ☀) in the top-right of the nav. It's site-wide, applies
instantly, and remembers the visitor's choice. Dark is the default brand
look; light is the alternate. This isn't something to edit per-page — if you
want to adjust either theme's exact colors, that's a single edit in
`app/globals.css`'s `:root[data-theme="light"]` (or the default block above
it for dark) — every page and component updates together automatically.

---

## What still needs a decision before full launch

**UnoSend delivery configuration.** Subscribe and Consultancy Enquiry are
wired to UnoSend. Subscribe sends a welcome email and a separate internal
signup notification; enquiries send a notification with the visitor's email
as the reply-to address. Configure `UNOSEND_FROM_EMAIL` and
`UNOSEND_NOTIFICATION_EMAIL` as documented in `.env.local.example`, then run
an end-to-end delivery test before launch. `EMAIL_PROVIDER_API_KEY` is accepted
as a temporary fallback for `UNOSEND_API_KEY`. UnoSend's live API does not yet
expose the contacts/audiences advertised by its SDK, so durable newsletter-list
storage remains a follow-up.

**Legal pages.** The Sanity-managed Privacy Policy and Terms intentionally
retain working-draft notices and placeholder date/contact/address values. Get
them reviewed and completed by counsel before public launch.

**Images.** The current build is intentionally text-and-typography led, the
same way the original design was. If you want hero images on articles, add
them directly in the Sanity Studio — the schema already supports it.

---

## Project structure, if you bring in a developer

```
app/              — every page and route (Next.js App Router)
components/       — shared UI: Nav, Footer, article cards, ticker, cursor
lib/sanity/       — the CMS client, image helper, and content queries
lib/types.ts      — shared TypeScript types and tag styling
sanity/           — the CMS schema (Article content type)
sanity.config.ts  — the Sanity Studio configuration, embedded at /studio
```

---

Hivig™ — Trademark Class 42, India. Naganarai Media Tech Private Limited.
