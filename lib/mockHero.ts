import type { HomepageHero } from "./types";

// Placeholder homepage hero content — used until a real "Homepage Hero"
// document is published in the Sanity Studio (see README: Step 2/6). Same
// fallback pattern as lib/mockArticles.ts. The creative director edits the
// real copy, links, and media at /studio — no code change needed.
export const mockHero: HomepageHero = {
  eyebrow: "Choose your path · Hi-Tech Vigilance",
  mediaType: "animation",
  choices: [
    {
      label: "See What's Winning",
      description: "Live rankings of the AI models actually worth your attention.",
      href: "/race",
      accent: "signal",
    },
    {
      label: "Build It Right",
      description: "Describe the agent you need. Get a real quote, not a demo.",
      href: "/agents",
      accent: "verify",
    },
    {
      label: "Know Before You Build",
      description: "Independent analysis — no vendor hype, ever.",
      href: "/intel",
      accent: "amber",
    },
  ],
};
