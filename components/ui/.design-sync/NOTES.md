# design-sync notes — @hivig/design-system

## Context

This package (`components/ui/`) is a **new** hand-authored component library — it doesn't
wrap or wrap existing app code. It was built specifically to give the "Hivig Signal Room"
design system (an earthy, light-mode-first palette — see the mockup canvas this was based
on) real, working React components that Claude Design's design agent can build with.

It's a standalone buildable package (own `package.json`, `tsup` build, own `node_modules`)
nested inside the main `hivig-web` Next.js app, but it is **not yet imported by any real
page** in that app. `components/` at the repo root (Nav, RaceHero, AgentIntakeForm, etc.)
is unrelated legacy app code using the old dark-editorial tokens — don't confuse the two.

## Build setup

- Package manager: npm (matches the parent repo).
- Build: `cd components/ui && npm run build` (tsup → `dist/{index.js,index.mjs,index.d.ts,index.css}`).
- No Storybook, no docs directory — `shape: "package"`, previews are 100% authored
  (`.design-sync/previews/*.tsx`), none generated from real usage examples (there were none
  to port from — this is a first pass).
- Styling: plain CSS with `hvg-` prefixed class names + `--hvg-*` CSS custom properties
  defined in `src/tokens.css`. No Tailwind, no CSS Modules (kept deliberately simple so the
  esbuild-based converter bundles it without extra plugins).
- Fonts (Geist, JetBrains Mono) load at runtime from Google Fonts via `src/fonts.css`
  (`[FONT_REMOTE]`, non-blocking, no local font files shipped).
- No provider/context needed — components read only their own props + the CSS tokens.
- `cfg.overrides.Nav: {"cardMode": "column"}` — Nav is a full-width bar, wider than a
  standard grid cell; without this it triggers `[GRID_OVERFLOW]`.

## Known render warns

None outstanding — the only warn seen (`[GRID_OVERFLOW]` on Nav) was resolved via the
override above.

## Re-sync risks

- **v0.1 scope is intentionally small**: Button, Badge, Input, Card, LeaderboardCard,
  QuoteCard, StatCard, Nav. The original design canvas also had an alert/toast component
  and several CSS-only 3D/motion hero elements (orbit sphere, morphing blob, kinetic
  wordmark, hover-tilt card) that were **not** ported into real components yet — they're a
  natural next batch.
- **Preview content is illustrative, not pulled from production data.** LeaderboardCard/
  QuoteCard examples use realistic-looking but invented sample values (model names, HVI
  scores, quote figures) — there's no real API wired in yet. If real Race/Agent Store data
  shapes drift from what's modeled in these props (see the real fields documented in this
  repo's `sanity/schemaTypes/documents/raceData.ts` and `lib/pricing-engine.ts`), the
  component props should be re-checked against them before this becomes production code.
- **Dark mode is implemented in tokens (`[data-hvg-theme="dark"]`) but never captured/graded**
  — only the light-mode palette was verified visually. Confirm dark mode manually before
  relying on it.
- This package has never been imported into the real Next.js app — integrating it will
  surface issues this isolated build can't (e.g. how `data-hvg-theme` should sync with the
  app's own existing `data-theme` toggle in `components/ThemeToggle.tsx`, which currently
  drives a *different*, older token system).
