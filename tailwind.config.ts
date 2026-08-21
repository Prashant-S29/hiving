import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// DESIGN SYSTEM — Tailwind reads its palette from CSS custom properties
// defined once in app/globals.css (:root). That is the actual single file to
// edit to recolor the whole site — this file just teaches Tailwind the
// semantic names (bg-signal, text-ink, etc.) and wires them to those
// variables so opacity modifiers (bg-signal/10, text-ink/75, ...) keep
// working. Raw CSS and inline styles read the same variables directly, so
// there is exactly one number to change per color, not three.
//
// Quick recolor examples:
//   - Change the whole app's accent color: edit --color-signal in globals.css.
//   - Change body copy font: edit fontFamily.body below.
//   - Lighten/darken the dark theme: edit --color-void/deep/surface/lift.
// ---------------------------------------------------------------------------

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // components/ui is @hivig/design-system — a standalone nested package
    // with its own node_modules and its own plain-CSS styling (no Tailwind
    // at all, see components/ui/.design-sync/NOTES.md). Without this
    // exclusion the glob above also matches components/ui/node_modules/**,
    // which Tailwind flags as an accidental full node_modules scan.
    "!./components/ui/**",
  ],
  theme: {
    extend: {
      colors: {
        void: "rgba(var(--color-void), <alpha-value>)",
        deep: "rgba(var(--color-deep), <alpha-value>)",
        surface: "rgba(var(--color-surface), <alpha-value>)",
        lift: "rgba(var(--color-lift), <alpha-value>)",
        paper: "rgba(var(--color-paper), <alpha-value>)",
        cream: "rgba(var(--color-cream), <alpha-value>)",
        signal: "rgba(var(--color-signal), <alpha-value>)",
        "signal-dark": "rgba(var(--color-signal-dark), <alpha-value>)",
        amber: "rgba(var(--color-amber), <alpha-value>)",
        verify: "rgba(var(--color-verify), <alpha-value>)",
        ink: "rgba(var(--color-ink), <alpha-value>)",
        muted: "rgba(var(--color-muted), <alpha-value>)",
        dim: "rgba(var(--color-dim), <alpha-value>)",
        rule: "rgba(var(--color-rule-base), var(--rule-alpha))",
        "rule-strong": "rgba(var(--color-rule-base), var(--rule-strong-alpha))",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"], // display headlines, logo
        body: ["var(--font-baskerville)", "Georgia", "serif"], // long-form copy
        mono: ["var(--font-dmmono)", "monospace"], // labels, timestamps, data
        sans: ["var(--font-barlow)", "system-ui", "sans-serif"], // UI chrome, buttons
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
