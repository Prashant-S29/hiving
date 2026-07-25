const STATS = [
  { n: "8", suffix: "+", label: "Platforms Independently Reviewed" },
  { n: "Zero", suffix: "", label: "Vendor Sponsorships. Ever." },
  { n: "100", suffix: "%", label: "Guides Tested Before Publishing" },
  { n: "$47", suffix: "B", label: "Market Under Our Watch" },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-b border-rule max-w-content mx-auto">
      {STATS.map((s, i) => (
        <div key={i} className="px-6 md:px-10 py-10 border-r border-rule last:border-r-0 hover:bg-surface transition-colors">
          <div className="font-serif text-[44px] md:text-[52px] font-bold tracking-tight leading-none mb-1.5">
            {s.n}<span className="text-signal">{s.suffix}</span>
          </div>
          <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
