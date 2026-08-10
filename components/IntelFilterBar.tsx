import Link from "next/link";
import type { EditorialSettings } from "@/lib/sanity/editorialSettings";

function buildHref(params: { category?: string; platform?: string }) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.platform) qs.set("platform", params.platform);
  const s = qs.toString();
  return s ? `/intel?${s}` : "/intel";
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 border transition-colors ${
        active
          ? "bg-signal border-signal text-white"
          : "border-rule-strong text-muted hover:text-ink hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export default function IntelFilterBar({
  activeCategory,
  activePlatform,
  platforms,
  categories,
  allCategoriesLabel,
  allPlatformsLabel,
}: {
  activeCategory?: string;
  activePlatform?: string;
  platforms: string[];
  categories: EditorialSettings["categories"];
  allCategoriesLabel: string;
  allPlatformsLabel: string;
}) {

  return (
    <div className="mb-14 space-y-5">
      <div className="flex flex-wrap gap-2">
        <Pill href={buildHref({ platform: activePlatform })} active={!activeCategory}>
          {allCategoriesLabel}
        </Pill>
        {categories.map((category) => (
          <Pill
            key={category._key || category.value}
            href={buildHref({ category: activeCategory === category.value ? undefined : category.value, platform: activePlatform })}
            active={activeCategory === category.value}
          >
            {category.label}
          </Pill>
        ))}
      </div>

      {platforms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Pill href={buildHref({ category: activeCategory })} active={!activePlatform}>
            {allPlatformsLabel}
          </Pill>
          {platforms.map((p) => (
            <Pill
              key={p}
              href={buildHref({ category: activeCategory, platform: activePlatform === p ? undefined : p })}
              active={activePlatform === p}
            >
              {p}
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}
