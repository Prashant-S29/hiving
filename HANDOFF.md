# Handoff — Hivig web app

This is the full Hivig site: the editorial platform (Intel, Manifesto, About,
Consultancy, Subscribe) plus two product features (The Race, Agent Store)
merged into one Next.js 14 App Router codebase. `README.md` has full local
setup steps; this doc is scoped to **getting it live in ~3 days**.

## What's already built and working

- Editorial site: homepage, Intel article index + article pages, Manifesto,
  About, Consultancy, Subscribe, legal pages — all wired to Sanity CMS with a
  graceful mock-content fallback when Sanity isn't configured yet.
- **The Race** (`/race`): AI model leaderboard with per-model pages and a
  ranking-methodology page. Seed data is real model names/orgs/dates but
  **benchmark scores and market/funding data are intentionally placeholder**
  (`data/seed-models.ts` header explains why — don't launch this claiming
  sourced numbers without actually sourcing them first).
- **Agent Store** (`/agents`, `/agents/discover`): a pricing-quote engine
  (`lib/pricing-engine.ts`) and a Claude-API-powered "instant feasibility
  study" flow. Both fully functional; verified end-to-end.
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
| `SANITY_API_WRITE_TOKEN` | Only if you add server-side writes later | Not needed for launch |
| `EMAIL_PROVIDER_API_KEY` | Subscribe form actually sending anything | Not wired yet — see Gaps below |
| `ANTHROPIC_API_KEY` | `/agents/discover`'s live AI generation | console.anthropic.com |

Without `NEXT_PUBLIC_SANITY_*` set, the site runs fine on mock content —
useful for a first deploy, not for real launch (no real articles/hero).
Without `ANTHROPIC_API_KEY`, `/agents/discover` shows a clear config error;
everything else still works.

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
2. Fill in the Homepage Hero doc with real choice-card copy (placeholders
   are functional but generic — see `lib/mockHero.ts` for what they currently
   say).
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

- **Subscribe form doesn't send anything yet** — `app/api/subscribe/route.ts`
  just logs submissions server-side. Wire in Resend/ConvertKit/Beehiiv (all
  simple APIs) or decide this is a post-launch task.
- **Legal pages are placeholders** — `app/legal/privacy/page.tsx` and
  `app/legal/terms/page.tsx` need real counsel-reviewed copy.
- **Race Tracker benchmark/funding data is unsourced** — see
  `data/seed-models.ts` and `RANKING_METHODOLOGY.md`. The ranking itself is
  also a placeholder formula (sorts by release date), not a real methodology.
- **Model logos are all a placeholder icon** — `public/logos/README.md`
  explains what's needed (real licensed logos + a source log).
- **Agent Store pricing constants are illustrative** — `lib/pricing-engine.ts`
  has real formula logic but placeholder dollar figures (hourly rates, model
  cost, markup, geo multipliers). Confirm real numbers before taking orders.

None of these block a *technical* launch — the app works correctly either
way — but they're product/content decisions, not code, so flagging them here
rather than letting them get discovered after launch.
