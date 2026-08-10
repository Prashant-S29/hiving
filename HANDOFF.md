# Handoff — Hivig web app

This is the full Hivig site: the editorial platform (Intel, Manifesto, About,
Consultancy, Subscribe) plus two product features (The Race, Agent Store)
merged into one Next.js 14 App Router codebase. `README.md` has full local
setup steps; this doc is scoped to **getting it live in ~3 days**.

## What's already built and working

- Editorial site: homepage, Intel article index + article pages, Manifesto,
  About, Consultancy, Subscribe, legal pages — all wired to Sanity CMS with
  strict production failure handling. Intel uses
  reusable Author, Article Type, Industry, Platform, and Source records; the
  original six article slugs were preserved during reference normalization.
- **The Race** (`/race`): Sanity-managed model leaderboard, per-model pages,
  and methodology page. Race Data contains 16 organizations, 18 models, and 18
  unscored benchmark records. Every migrated record is explicitly unverified;
  there are no source records because the original seed had no defensible URLs.
  Ranking remains a protected release-date placeholder calculation in code.
- **Agent Store** (`/agents`, `/agents/pricing`, `/agents/discover`): a
  pricing-quote engine (`lib/pricing-engine.ts`) and Claude-API-powered
  feasibility flow. All page, quote-form, pricing-label, and result-interface
  copy is managed in Sanity; calculations and AI behavior remain in code.
  Quote generation is functional. Live Discover generation still requires an
  `ANTHROPIC_API_KEY` and has not been exercised in the current environment.
- Site-wide light/dark theme toggle, CMS-editable homepage hero (interactive
  animated picker / image / video, singleton in the Studio) — see README's
  "Editing the homepage hero" and "Light / dark mode" sections.
- Full design token system in `tailwind.config.ts` + `app/globals.css` — one
  place to touch for any brand color/font change.

## Environment variables needed (see `.env.local.example`)

| Variable | Required for | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | CMS (articles, homepage hero) | `npx create-sanity@latest` — README Step 2 |
| `NEXT_PUBLIC_SANITY_DATASET` | CMS | same, usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | CMS | pin to a date, e.g. `2024-01-01` |
| `SANITY_API_WRITE_TOKEN` | CMS migration/seed scripts | Sanity Editor token; never expose publicly |
| `SANITY_API_READ_TOKEN` | Authenticated draft preview | Minimum-scope Sanity Viewer token |
| `SANITY_REVALIDATE_SECRET` | Signed publish webhook | Shared secret configured in Sanity and Vercel |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | Presentation frontend | `https://hivig.com` in production |
| `SANITY_ALLOW_FALLBACKS` | Emergency CMS fallback | Keep `false`; enable only during a monitored incident |
| `UNOSEND_API_KEY` | Subscribe and consultancy email delivery | UnoSend dashboard (`EMAIL_PROVIDER_API_KEY` is a temporary fallback) |
| `UNOSEND_FROM_EMAIL` | Verified sender identity | An address on the verified `hivig.com` domain |
| `UNOSEND_NOTIFICATION_EMAIL` | Consultancy enquiry destination/reply-to | Client-owned monitored inbox |
| `ANTHROPIC_API_KEY` | `/agents/discover`'s live AI generation | console.anthropic.com |

Without `NEXT_PUBLIC_SANITY_*`, local development can use fixtures, but a
production build/request fails explicitly. Do not set `SANITY_ALLOW_FALLBACKS`
to `true` except as a temporary, monitored emergency response.
Without `ANTHROPIC_API_KEY`, `/agents/discover` cannot generate a live study
and shows the CMS-managed fallback error; everything else still works.

## Suggested 3-day plan

**Day 1 — infrastructure**
1. `npm install`, confirm it builds locally (`npm run build`).
2. Create the Sanity project (README Step 2), set env vars locally, confirm
   `/studio` loads and you can publish a test article + the Homepage Hero doc.
3. Create a Vercel project from this repo, add all env vars there too, get a
   first `.vercel.app` preview deploy working.
4. Get a real `ANTHROPIC_API_KEY`, add it to Vercel env vars, verify
   `/agents/discover` generates a real result on the preview URL.

**Day 2 — content + QA**
1. Write/publish 8–12 real articles in the Studio (README Step 6 has the
   checklist per article).
2. Review and publish the Homepage document, including choice cards and the
   approved section order/visibility controls.
3. Full click-through QA in **both** light and dark theme: homepage, Intel,
   an article, Manifesto, About, Consultancy, Subscribe, Race leaderboard, a
   model page, methodology, Agent Store quote flow, Discover flow.
4. Decide on the Race Tracker gaps (see below) — either source real
   benchmark/funding data before launch, or launch with the placeholder data
   clearly labeled as illustrative (current copy already does this on
   `/race/methodology`, but confirm that's acceptable for launch).

**Day 3 — go live**
1. Point `hivig.com` at Vercel (Vercel Domains settings → DNS records at your
   registrar — can take minutes to hours to propagate, start this early).
2. Final smoke test on the real domain (cookies/redirects/SEO metadata can
   behave differently than on `.vercel.app`).
3. Confirm `robots.txt`/`llms.txt`/sitemap behavior is what you want for a
   public launch (currently `public/llms.txt` lists all key pages).

## Known gaps to make a call on before public launch

- **UnoSend needs an end-to-end delivery test and a future subscriber store** —
  Subscribe sends a welcome email plus an internal signup notification;
  Consultancy Enquiry sends an internal notification. UnoSend's current live
  API does not expose the contacts/audiences advertised by its SDK, so it is
  not yet the durable newsletter list. Configure the `UNOSEND_*` variables
  from `.env.local.example` and verify delivery and reply-to behavior.
- **Legal pages require counsel review** — both documents are now managed in
  Sanity and intentionally retain working-draft notices, placeholder dates,
  address, and privacy-contact fields until qualified counsel approves them.
- **Race benchmark/funding data is unsourced** — the structured Sanity records
  are intentionally unverified and unscored. Add reviewed Source documents
  before entering claims. Ranking is still a placeholder formula (release date,
  newest first), not a real methodology; see `RANKING_METHODOLOGY.md`.
- **Model logos are all a placeholder icon** — `public/logos/README.md`
  explains what's needed (real licensed logos + a source log).
- **Agent Store pricing constants are illustrative** — `lib/pricing-engine.ts`
  has real formula logic but placeholder dollar figures (hourly rates, model
  cost, markup, geo multipliers). Confirm real numbers before taking orders.

None of these block a *technical* launch — the app works correctly either
way — but they're product/content decisions, not code, so flagging them here
rather than letting them get discovered after launch.
