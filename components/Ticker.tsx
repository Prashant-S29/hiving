import type { HomepageSectionSpacing, HomepageSectionVariant } from "@/lib/types";

const spacingClasses: Record<HomepageSectionSpacing, string> = { compact: "py-2", normal: "py-3", large: "py-5" };

export default function Ticker({ items: sourceItems, spacing = "normal", variant = "default" }: {
  items: string[];
  spacing?: HomepageSectionSpacing;
  variant?: HomepageSectionVariant;
}) {
  const items = [...sourceItems, ...sourceItems];
  return (
    <div className={`${variant === "alternate" ? "bg-surface" : "bg-deep"} border-y border-rule overflow-hidden ${spacingClasses[spacing]}`}>
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((p, i) => (
          <div key={i} className="inline-flex items-center gap-3.5 px-9 font-mono text-[11px] tracking-[0.1em] uppercase text-muted flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span className="text-ink">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
