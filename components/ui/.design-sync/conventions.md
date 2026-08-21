## Hivig Signal Room — conventions

**Setup.** No provider or wrapper is required — there's no ThemeProvider or context to mount. Import the stylesheet once at your app root:

```jsx
import "@hivig/design-system/styles.css";
```

That single import pulls in the Geist + JetBrains Mono webfonts (loaded at runtime from Google Fonts), every design token, and every component's compiled CSS. Without it, components render with browser-default styling.

**Dark mode.** Set `data-hvg-theme="dark"` on any ancestor element (typically `<html>` or `<body>`) to flip every token to the dark palette. No prop, no wrapper — it's a plain CSS attribute selector, e.g. `document.documentElement.setAttribute("data-hvg-theme", "dark")`.

**Styling idiom — CSS custom properties, no utility classes.** Every color, font, radius, and shadow is a `var(--hvg-*)` token defined once in the shipped stylesheet. Components use them internally; when composing your own layout around them, reach for the same tokens rather than inventing new colors:

| Token | Use |
|---|---|
| `--hvg-paper`, `--hvg-surface`, `--hvg-surface-container[-high]` | page background → card background → nested container, light to dark |
| `--hvg-border`, `--hvg-border-strong` | hairline borders (always pair with a real box-shadow, not just a heavier border, for card elevation) |
| `--hvg-text-primary` → `--hvg-text-dim` | four-step text hierarchy, most to least prominent |
| `--hvg-ember` / `--hvg-ember-strong` / `--hvg-ember-vivid` | the one brand accent — "actively tracking/watching." Use for primary actions, live indicators, focus rings, active nav state. Never for danger. |
| `--hvg-clay`, `--hvg-sage` | secondary/tertiary accents — clay for down-trend or secondary emphasis, sage for success/verified/growth |
| `--hvg-danger`, `--hvg-warning` | reserved strictly for genuine alert/attention states |
| `--hvg-font-display` (Geist), `--hvg-font-mono` (JetBrains Mono) | display/body text vs. anything technical — timestamps, IDs, scores, prices |
| `--hvg-radius-sm/md/lg/full` | 4 / 8 / 12 / pill — containers stay near-square, interactive elements soften slightly, only status pills go full-round |

**Where the truth lives.** Read `dist/index.css` (the compiled stylesheet — every token and component class) and each component's own `.d.ts` before styling anything new. The per-component docs in this bundle are generated from those same `.d.ts` files plus the authored preview examples — they're accurate to what's actually shipped.

**Build example** — a real composition using the shipped components together:

```jsx
import { Nav, LeaderboardCard, QuoteCard, Button } from "@hivig/design-system";
import "@hivig/design-system/styles.css";

export default function RacePage() {
  return (
    <>
      <Nav
        links={[
          { label: "Race", href: "/race", active: true },
          { label: "Agents", href: "/agents" },
        ]}
        statusLabel="Tracking live"
        avatarInitials="AS"
      />
      <LeaderboardCard
        rank={1}
        rankDelta={2}
        modelName="Gemini 2.0 Flash"
        orgName="Google DeepMind"
        orgInitials="GD"
        country="US"
        modelType="frontier"
        hviScore={91.2}
      />
      <Button variant="primary">Get my quote</Button>
    </>
  );
}
```

**Component set (v0.1).** Button, Badge (verification status), Input, Card (generic surface), LeaderboardCard, QuoteCard, StatCard, Nav — the pieces most redesign work reuses first. This is a first pass: alert/toast, the 3D/motion hero elements from the original design canvas, and additional composed layouts are not yet built as real components.
