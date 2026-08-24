import { OrbitHomepage } from "@/components/homepage/orbit/OrbitHomepage";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { getRaceModels } from "@/lib/sanity/race";

// Homepage — "Orbit" direction, ported from Claude Design. The previous
// CMS-driven homepage (Sanity-backed hero/sections) is still intact as
// components/files (HomepageSections, InteractiveHero, HeroChoiceCards,
// lib/mockHero, the getFeatured/getHomepage data loaders) — just no longer
// referenced from this route. Swap this file's contents back if we need to
// restore it before the CMS-driven version is reconnected to this design.
//
// getSiteSettings() is also called in RootLayout (for the now-shared Nav);
// it's wrapped in React's cache(), so this is a free request-memoized call,
// not a duplicate fetch.
export default async function HomePage() {
  const [settings, raceModels] = await Promise.all([getSiteSettings(), getRaceModels()]);
  return <OrbitHomepage settings={settings} raceModels={raceModels} />;
}
