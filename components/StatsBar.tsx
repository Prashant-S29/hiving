import type { HomepageSectionSpacing, HomepageSectionVariant, HomepageStat } from "@/lib/types";

const spacingClasses: Record<HomepageSectionSpacing, string> = { compact: "py-6", normal: "py-10", large: "py-14" };

export default function StatsBar({ stats, spacing = "normal", variant = "default" }: {
  stats: HomepageStat[];
  spacing?: HomepageSectionSpacing;
  variant?: HomepageSectionVariant;
}) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 border-b border-rule max-w-content mx-auto ${variant === "alternate" ? "bg-surface" : ""}`}>
      {stats.map((stat, index) => (
        <div key={stat._key || `${stat.label}-${index}`} className={`px-6 md:px-10 border-r border-rule last:border-r-0 hover:bg-surface transition-colors ${spacingClasses[spacing]}`}>
          <div className="font-serif text-[44px] md:text-[52px] font-bold tracking-tight leading-none mb-1.5">
            {stat.value}<span className="text-signal">{stat.suffix}</span>
          </div>
          <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
