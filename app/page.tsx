import { OrbitHomepage } from "@/components/homepage/orbit/OrbitHomepage";

// Homepage — "Orbit" direction, ported from Claude Design. The previous
// CMS-driven homepage (Sanity-backed hero/sections) is still intact as
// components/files (HomepageSections, InteractiveHero, HeroChoiceCards,
// lib/mockHero, the getFeatured/getHomepage data loaders) — just no longer
// referenced from this route. Swap this file's contents back if we need to
// restore it before the CMS-driven version is reconnected to this design.
export default function HomePage() {
  return <OrbitHomepage />;
}
