import Link from "next/link";
import type { RaceModel } from "@/lib/sanity/race";

/**
 * Live top-10 AI Race strip — same moving-marquee mechanic as the operator
 * logos below it, but real data (rank, model, org, Hivig Velocity Index)
 * instead of placeholder names. The whole strip is one link to /race.
 */
export function RaceScoreStrip({ models }: { models: RaceModel[] }) {
  const top10 = models.slice(0, 10);
  if (top10.length === 0) return null;

  return (
    <Link
      href="/race"
      aria-label="See the full live AI Race leaderboard"
      style={{ display: "block", background: "#fff8f5", borderBottom: "1px solid #ddc1ae", overflow: "hidden", padding: "20px 0", textDecoration: "none" }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#904d00",
          }}
        >
          <span className="hv-anim-blink" style={{ width: 6, height: 6, background: "#ff8c00", borderRadius: "50%" }} />
          Live AI Race · Top 10
        </span>
        <span style={{ flex: 1, height: 1, background: "#ddc1ae" }} />
        <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: "#904d00", fontWeight: 700, whiteSpace: "nowrap" }}>
          See the full leaderboard →
        </span>
      </div>

      <div className="hv-anim-marquee" style={{ display: "flex", width: "max-content" }}>
        {[0, 1].map((row) => (
          <div key={row} style={{ display: "flex", gap: 0, padding: "0 16px" }}>
            {top10.map((m) => (
              <div
                key={`${row}-${m.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 22px",
                  borderRight: "1px solid #ddc1ae",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#ff8c00",
                    color: "#241912",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {m.rank_current}
                </span>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#241912" }}>{m.model_name}</span>
                <span style={{ fontSize: 13, color: "#897362" }}>{m.org_name}</span>
                {typeof m.race_score === "number" ? (
                  <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, fontWeight: 700, color: "#904d00" }}>
                    {m.race_score.toFixed(1)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Link>
  );
}
