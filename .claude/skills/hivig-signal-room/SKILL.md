---
name: hivig-signal-room
description: >
  How to build or restyle UI in this repo using the "Hivig Signal Room" design
  system (@hivig/design-system, in components/ui/) — the new earthy
  light-mode-first palette (paper/ember/clay/sage) that's replacing the old
  dark-editorial theme, one area at a time. Use this whenever the task
  touches the Race page, Agent Store (pricing/discover), or any request to
  "redesign", "restyle", "use the new design system", "Signal Room", or make
  something look like the new @hivig/design-system components — even if the
  user just says "make the pricing page match the race page" or "use the new
  look here" without naming the package. Also consult this before adding any
  new component to components/ui/ itself, or before touching
  tailwind.config.ts's content globs or the root package.json's postinstall
  script (both have real, non-obvious gotchas documented below).
---

# Hivig Signal Room design system

This is a **pilot rollout, not a site-wide redesign**. As of 2026-08-22:

- **Migrated**: the full Race page (`app/race/page.tsx` — hero via `components/race-signal/SignalRaceHero.tsx`, leaderboard via `components/race-signal/SignalRaceTrack.tsx`) and the full Agent Store (`app/agents/page.tsx`, `app/agents/pricing/page.tsx`, `app/agents/discover/page.tsx`, plus `components/agent-signal/SignalAgentIntakeForm.tsx` and `SignalDiscoverSearch.tsx`). All wrapped in the shared `components/signal/SignalPageShell.tsx`.
- **Untouched, staying on the old dark-editorial theme**: the global Nav/Footer (`components/SiteChrome.tsx`), Intel, Manifesto, About, Consultancy, Subscribe, legal pages, `/race/methodology`, `/race/models/[slug]`, and the old `components/RaceHero.tsx`/`components/RaceTrack.tsx`/`components/AgentIntakeForm.tsx`/`components/DiscoverSearch.tsx` (left in place, unused, for comparison). If the next task is either of the two Race sub-pages, treat them as **not yet migrated** even though their parent `/race` is.

**Before touching anything, confirm scope.** If a request could plausibly mean "restyle this one page" or "redesign the whole site," ask — don't assume site-wide. `components/RaceHero.tsx` (old, dark) and `components/race-signal/SignalRaceHero.tsx` (new, light) both exist in this repo right now; it's easy to edit the wrong one. If you're not sure whether an area is in scope for the migration yet, treat it as **not** migrated and ask.

## Setup — verify before writing any component

Two pieces of plumbing make `@hivig/design-system` actually work in this Next.js app. Both are already wired up as of the Race pilot — **check they're still there** rather than re-adding them blindly (if they're missing, something regressed):

1. **Root `package.json` needs a `postinstall` script**: `npm --prefix components/ui install && npm --prefix components/ui run build`. Why: `components/ui/dist/` (where the package's `main`/`module`/`types`/`styles.css` all point) is gitignored — it's a build artifact, not source. Without this hook, a fresh `git clone` + `npm install` (exactly what Vercel does) has no `dist/`, and every `@hivig/design-system` import fails to resolve. If you ever see "Cannot find module '@hivig/design-system'" after a clean checkout, this is the first thing to check.
2. **`tailwind.config.ts`'s `content` array must exclude `components/ui/**`**. `components/ui` is a separate package with its own `node_modules` and plain CSS (no Tailwind at all — see below); without the exclusion, Tailwind's content glob also matches `components/ui/node_modules/**`, which it flags as an accidental full-node_modules scan and which slows builds for no benefit.

If you're setting this up fresh in a repo that doesn't have it yet: build the package (`cd components/ui && npm install && npm run build`), add it to the root `package.json` as `"@hivig/design-system": "file:./components/ui"`, add the `postinstall` script above, run `npm install` at the root, and **verify by simulating a clean install** — delete `components/ui/dist` and `node_modules/@hivig`, run `npm install` again, confirm `dist/` reappears and `npm run build`/`tsc --noEmit` both still pass. Don't skip this verification; it's the only way to know Vercel will actually succeed.

## Styling idiom — read this before writing a single className

Everything is `var(--hvg-*)` CSS custom properties and `hvg-`-prefixed classes, applied inline or via the component library — **no Tailwind, no new hardcoded hex colors, ever**, inside anything meant to render in this design system. If you catch yourself typing a hex code or an `rgb()` literal for anything Signal-Room-facing, stop — the value already exists as a token below, or it should be added to `components/ui/src/tokens.css` rather than inlined.

Import the stylesheet once per route, **scoped to that route's page or layout file** — not the root `app/layout.tsx` — so it doesn't leak into areas still on the old theme:

```tsx
import "@hivig/design-system/styles.css";
```

Next.js's App Router supports a global CSS import in any page/layout, and it only loads for that route subtree. This is how the Race pilot is scoped (imported directly in `SignalRaceHero.tsx`, which only `app/race/page.tsx` renders).

**Dark mode is unverified.** `[data-hvg-theme="dark"]` tokens exist in `tokens.css`, but nobody has visually checked them — treat dark mode as "implemented but not production-ready" until someone actually confirms it looks right. Don't wire it up to the site's existing `data-theme` toggle (`components/ThemeToggle.tsx`) without flagging that as new, unverified work.

### Token table

| Token | Use |
|---|---|
| `--hvg-paper`, `--hvg-paper-dim` | page background |
| `--hvg-surface`, `--hvg-surface-container`, `--hvg-surface-container-high` | card background → nested container, light to dark |
| `--hvg-border`, `--hvg-border-strong` | hairline borders — always pair with `--hvg-shadow-card` for elevation, not just a heavier border |
| `--hvg-text-primary` → `--hvg-text-secondary` → `--hvg-text-muted` → `--hvg-text-dim` | four-step text hierarchy, most to least prominent |
| `--hvg-ember` / `--hvg-ember-strong` / `--hvg-ember-vivid` / `--hvg-ember-soft` | the one brand accent — "actively tracking/watching." Primary actions, live indicators, focus rings, active nav state. **Never for danger.** |
| `--hvg-clay` | secondary accent — down-trend / secondary emphasis |
| `--hvg-sage` | tertiary accent — success / verified / growth |
| `--hvg-danger`, `--hvg-danger-soft`, `--hvg-warning`, `--hvg-warning-soft`, `--hvg-success-soft` | reserved strictly for genuine alert/attention states |
| `--hvg-font-display` (Geist) | display/body text |
| `--hvg-font-mono` (JetBrains Mono) | anything technical — timestamps, IDs, scores, prices |
| `--hvg-radius-sm` (4) / `-md` (8) / `-lg` (12) / `-full` (pill) | containers near-square, interactive elements soften slightly, only status pills go full-round |
| `--hvg-shadow-card` | real shadow depth for elevation — this system avoids flat heavy-outline cards |

Fonts load at runtime from Google Fonts via `components/ui/src/fonts.css` — no local font files, no extra setup needed.

## Component set (v0.1) — build from these first

```ts
import { Button, Badge, Input, Card, LeaderboardCard, QuoteCard, StatCard, Nav } from "@hivig/design-system";
```

| Component | Key props | Notes |
|---|---|---|
| `Button` | `variant?: "primary" \| "secondary" \| "ghost" \| "destructive"`, `size?: "sm" \| "md"` | One `primary` per view. `destructive` for flags/reports only. |
| `Badge` | `status: "verified" \| "in-review" \| "unverified" \| "disputed"`, `label?` | **Maps to the real `verificationStatus` field** on race/org/benchmark records — but that field's real values are `"unverified" \| "review" \| "verified"` (no `"disputed"`, and it's `"review"` not `"in-review"`). Translate explicitly: `status === "review" ? "in-review" : status`. There's no real-data equivalent of `"disputed"` yet — don't invent one. |
| `Input` | `label: string`, `error?: string` | Bottom-border field, real `:focus` styling. |
| `Card` | `padding?: "sm" \| "md" \| "lg"` | Generic base surface — reach for this before styling a raw `<div>`. |
| `LeaderboardCard` | `rank`, `rankDelta?`, `modelName`, `orgName`, `orgInitials`, `country`, `modelType: "frontier"\|"open-weight"\|"specialized"\|"agentic-framework"`, `hviScore: number \| null`, `live?` | Mirrors `lib/sanity/race.ts`'s `RaceModel`. **`hviScore` is nullable and today is null for every real model** (nothing's opted into the Velocity Index automation yet — see `scripts/fetch-race-metrics.ts`) — the component already renders "HVI —" for null, don't work around it by passing `0`. `orgInitials` isn't derived automatically; compute it (first letters of the first two words of `orgName`, see `SignalRaceHero.tsx`'s `orgInitials()` helper — reuse it rather than re-deriving). |
| `QuoteCard` | `quotedPriceUSD`, `geoRegion`, `modelUsed`, `expertiseTier: "Junior"\|"Mid"\|"Senior"` (capitalized!), `estimatedTokens`, `estimatedHumanHours`, `modelCreditsCostUSD`, `humanHoursCostUSD`, `onGetDetailedQuote?`, `onAdjustInputs?` | **Two real mismatches to handle when wiring this to `lib/pricing-engine.ts`'s `computeQuote()`**, confirmed by reading both side by side: (1) the real `ExpertiseTier` type is lowercase (`"junior"\|"mid"\|"senior"`) — capitalize before passing in; (2) the real `QuoteBreakdown`'s `modelUsed`/`estimatedTokens`/`estimatedHumanHours`/`expertiseTier` are nested under `breakdown: {...}`, not flat on the top-level object — destructure `quote.breakdown.modelUsed` etc. `internalCostUSD` (the real internal cost) has no prop here by design — don't expose it. |
| `Nav` | `links: {label, href, active?}[]`, `statusLabel?`, `avatarInitials?`, `onNavigate?` | This is a **new** Nav, visually and structurally different from `components/SiteChrome.tsx`'s current one. Do not swap the global site Nav for this without an explicit, separate decision — it's out of scope for the Race/Agent Store pilot. If you do use it in a grid/preview context, it needs `cardMode: "column"` (see `components/ui/.design-sync/config.json`) since it's full-width, not a standard grid cell. |

**Not built yet — say so, don't fake it.** The original design canvas also had an alert/toast component and several CSS-only 3D/motion hero elements (orbit sphere, morphing blob, kinetic wordmark, hover-tilt card) that were never ported into real components. If a task needs one of these, tell the user it doesn't exist yet as a real component rather than approximating it with ad-hoc CSS that claims to be part of the design system — that's exactly the kind of drift NOTES.md warns about.

## Building a new page or section

1. Confirm scope (above) — is this area actually meant to migrate yet?
2. Import the stylesheet in that route's page/layout file only.
3. Compose from the v0.1 components first; drop to raw `--hvg-*` tokens (inline `style` or arbitrary-value Tailwind like `className="text-[color:var(--hvg-ember)]"` — fine to use Tailwind for *layout* utilities like flex/grid/spacing, just never for *color*) only for structure the shipped components don't cover yet, like `SignalRaceHero.tsx`'s animated SVG track.
4. Before wiring any component to real data (Sanity, the pricing engine, anything in `lib/`), read that data's actual TypeScript type and compare it field-by-field against the component's props — don't assume they match. This session found two real mismatches this way (`Badge` status values, `QuoteCard`'s nested/capitalization differences) just by checking; assume more exist until verified.
5. Handle nulls. Real production data is genuinely incomplete right now (every race score is null, benchmark scores are mostly unsourced) — a component that assumes a required number will break on real data even if it typechecks against a hand-written preview example.
6. Build (`npm run build`, `tsc --noEmit`) and, if the change is visually observable, verify it in a live dev server against real data — computed-style checks (`getComputedStyle(...).backgroundColor` etc.) are a reliable way to confirm the actual token values resolved, not just that the code compiled.

## Where the deeper detail lives

- `components/ui/.design-sync/conventions.md` — the original authored conventions doc this skill is distilled from.
- `components/ui/.design-sync/NOTES.md` — build setup, what's out of scope for v0.1, re-sync risks.
- `components/ui/src/tokens.css` — the actual token values, source of truth over the table above if they ever diverge.
- `components/ui/src/index.ts` — the exact current export list; check this if a component might have been added/renamed since this skill was written.
- `components/signal/SignalPageShell.tsx`, `components/race-signal/*`, `components/agent-signal/*` — real, shipped examples of composing this system against live Sanity/API data end to end (the Race page and the whole Agent Store). Read the closest analog before building the next piece rather than starting from scratch — e.g. `SignalAgentIntakeForm.tsx` for any new form, `SignalRaceTrack.tsx` for any new data grid.
