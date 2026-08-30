import Link from "next/link";
import Nav from "@/components/Nav";
import type { SiteSettings } from "@/lib/sanity/siteSettings";
import type { RaceModel } from "@/lib/sanity/race";
import { OrbitalHero } from "./OrbitalHero";
import { RaceScoreStrip } from "./RaceScoreStrip";
import "./orbit-hero.css";

// Geist and JetBrains Mono are loaded once, globally, in app/layout.tsx —
// this page just references them ('Geist' / var(--font-jetbrains-mono)).

const marqueeNames = ["NORTHWIND", "Arclight", "MERIDIAN", "Foundry AI", "Halcyon", "BRIGHTPATH", "Kestrel", "OMNICORE"];

const articles = [
  {
    kicker: "REVIEW · 9 MIN",
    title: "Six coding agents, one legacy monolith, zero mercy",
    deck: "We pointed them at 40k lines of undocumented Java. Only two survived.",
  },
  {
    kicker: "BRIEFING · 6 MIN",
    title: "The new pricing games in agent platforms",
    deck: "Per-token is out. Per-outcome billing is quietly reshaping budgets.",
  },
  {
    kicker: "FIELD NOTE · 4 MIN",
    title: "What breaks when an agent runs unattended for 30 days",
    deck: "Drift, silent failures, and the logging you wish you'd set up.",
  },
];

const scorecard = [
  { label: "Reliability", value: "B+", color: "#ffb77d" },
  { label: "Transparency", value: "A−", color: "#ffb77d" },
  { label: "Cost to run", value: "C", color: "#dcb8ff" },
  { label: "Safety posture", value: "A", color: "#85cfff" },
];

const stats = [
  { value: "8+", label: "Platforms reviewed", color: "#241912" },
  { value: "Zero", label: "Sponsorships", color: "#904d00" },
  { value: "$47B", label: "Under watch", color: "#241912" },
  { value: "24k", label: "Operators reading", color: "#241912" },
];

/**
 * Hivig homepage — "Orbit" direction. Ported from the Claude Design
 * prototype (`Hivig Home Orbit.dc.html`) faithfully, including its exact
 * copy and the original Solar Kinetic palette (this predates the Signal
 * Room adaptation and intentionally isn't reconciled with it here).
 */
export function OrbitHomepage({ settings, raceModels }: { settings: SiteSettings; raceModels: RaceModel[] }) {
  return (
    <div className="hv-orbit-root hv-orbit-grain" style={{ fontFamily: "'Geist', system-ui, sans-serif", color: "#241912", background: "#fff8f5" }}>
      <Nav settings={settings} />

      {/* ============ ORBITAL HERO ============ */}
      <div
        style={{
          position: "relative",
          minHeight: 760,
          background: "radial-gradient(120% 130% at 76% 14%, #ffdcbb 0%, #ffe9db 34%, #fff2ea 66%, #fff8f5 100%)",
          overflow: "hidden",
          borderBottom: "1px solid #ddc1ae",
        }}
      >
        <div
          className="hv-anim-bloom"
          style={{
            position: "absolute",
            top: "44%",
            left: "82%",
            width: 420,
            height: 420,
            margin: "-210px 0 0 -210px",
            pointerEvents: "none",
            background: "radial-gradient(circle, rgba(255,163,56,0.34) 0%, rgba(255,183,125,0.16) 36%, rgba(255,214,180,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: "40%",
            right: "14%",
            height: 260,
            marginTop: -130,
            pointerEvents: "none",
            background: "linear-gradient(90deg, rgba(255,196,138,0) 0%, rgba(255,182,116,0.12) 64%, rgba(255,166,88,0.2) 100%)",
            filter: "blur(26px)",
          }}
        />

        <OrbitalHero orbitSpeed={1} driftSpeed={3} planeLean={22} showTrails />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,248,245,0.97) 0%, rgba(255,248,245,0.95) 40%, rgba(255,248,245,0.76) 54%, rgba(255,248,245,0.3) 66%, rgba(255,248,245,0) 78%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1440, margin: "0 auto", padding: "112px 32px 128px" }}>
          <div className="hv-anim-rise" style={{ maxWidth: 700 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6e3900",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid #ddc1ae",
                padding: "7px 13px",
                borderRadius: 9999,
                marginBottom: 28,
              }}
            >
              <span className="hv-anim-blink" style={{ width: 8, height: 8, background: "#ff8c00", borderRadius: "50%", boxShadow: "0 0 0 3px rgba(255,140,0,0.25)" }} />
              Live Intelligence Feed · Active
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 74, lineHeight: 1.02, letterSpacing: "-0.04em", color: "#241912", margin: 0 }}>
              The vigilant voice of{" "}
              <span
                style={{
                  background: "linear-gradient(115deg,#ff8c00 0%,#904d00 60%,#821dda 130%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                agentic AI
              </span>
              .
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "#564334", margin: "24px 0 36px", maxWidth: "52ch" }}>
              Independent enough to tell you the truth about every platform. Rigorous for the engineers who build agents, clear for the executives who bet on
              them.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <Link
                href="/intel"
                style={{
                  background: "#ff8c00",
                  color: "#241912",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "15px 26px",
                  borderRadius: 8,
                  border: "1px solid #904d00",
                  boxShadow: "0 14px 40px -14px rgba(255,140,0,0.8)",
                }}
              >
                Read the Latest Intel →
              </Link>
              <Link
                href="/compare"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid #897362",
                  color: "#241912",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "14px 24px",
                  borderRadius: 8,
                }}
              >
                ▶ Compare Models
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 0,
              marginTop: 92,
              border: "1px solid #ddc1ae",
              borderRadius: 4,
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(12px)",
              maxWidth: 880,
              overflow: "hidden",
            }}
          >
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: "22px 24px", borderLeft: i > 0 ? "1px solid #ddc1ae" : undefined }}>
                <div style={{ fontWeight: 800, fontSize: 36, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "#897362", marginTop: 6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RaceScoreStrip models={raceModels} />

      {/* ============ LOGO MARQUEE ============ */}
      <div style={{ background: "#fff1e9", borderBottom: "1px solid #ddc1ae", overflow: "hidden", padding: "24px 0" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#897362",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Read by operators at
        </div>
        <div className="hv-anim-marquee" style={{ display: "flex", width: "max-content" }}>
          {[0, 1].map((row) => (
            <div key={row} style={{ display: "flex", gap: 56, padding: "0 28px", fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em", color: "#c6ac97" }}>
              {marqueeNames.map((name) => (
                <span key={`${row}-${name}`}>{name}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ FEATURED DEEP DIVE ============ */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "2px solid #241912", paddingBottom: 14, marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#904d00" }}>
            // This week's dispatch
          </div>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, color: "#897362" }}>Vol. 12 · Aug 2026</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 0, border: "1px solid #ddc1ae", borderRadius: 4, overflow: "hidden" }}>
          <Link href="/intel" style={{ display: "block", padding: 46, borderRight: "1px solid #ddc1ae", background: "#ffffff" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6e3900",
                background: "#ffeadd",
                border: "1px solid #ddc1ae",
                padding: "6px 11px",
                borderRadius: 9999,
                marginBottom: 22,
              }}
            >
              <span style={{ width: 6, height: 6, background: "#ff8c00", borderRadius: "50%" }} />
              Deep Dive
            </span>
            <h2 style={{ fontWeight: 700, fontSize: 42, lineHeight: 1.06, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
              The Autonomous Agent Is No Longer a Prototype.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#564334", margin: "0 0 28px", maxWidth: "46ch" }}>
              Enterprise AI crossed a threshold this quarter. Agents are signing contracts, shipping code to production, and closing tickets without a human
              in the loop. We stress-tested eight of them so you don&apos;t have to.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, color: "#897362" }}>
              <span style={{ color: "#904d00", fontWeight: 700 }}>Read the analysis →</span>
              <span>14 min read</span>
            </div>
          </Link>
          <div
            style={{
              background: "linear-gradient(155deg,#2f1500 0%,#3a2e25 60%,#2c0051 130%)",
              padding: 46,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#ffede3",
            }}
          >
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#ffb77d" }}>
              Verdict scorecard
            </div>
            <div>
              {scorecard.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "13px 0",
                    borderBottom: i < scorecard.length - 1 ? "1px solid rgba(255,183,125,0.22)" : undefined,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{row.label}</span>
                  <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: "#ffb77d" }}>Independently scored · no vendor input</div>
          </div>
        </div>
      </div>

      {/* ============ ARTICLE GRID ============ */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 32px 0" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#904d00",
            borderBottom: "2px solid #241912",
            paddingBottom: 14,
          }}
        >
          // Latest intel
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: "1px solid #ddc1ae", borderTop: "none", borderRadius: "0 0 4px 4px", overflow: "hidden" }}>
          {articles.map((a, i) => (
            <Link
              key={a.title}
              href="/intel"
              style={{ display: "block", padding: "30px 30px 34px", borderRight: i < articles.length - 1 ? "1px solid #ddc1ae" : undefined, background: "#ffffff" }}
            >
              <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: "#904d00", marginBottom: 14, letterSpacing: "0.05em" }}>{a.kicker}</div>
              <h3 style={{ fontWeight: 600, fontSize: 22, lineHeight: 1.14, letterSpacing: "-0.02em", margin: "0 0 10px" }}>{a.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#564334", margin: 0 }}>{a.deck}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ============ MANIFESTO / CTA POSTER ============ */}
      <div style={{ maxWidth: 1440, margin: "64px auto 0", padding: "0 32px" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            border: "1px solid #904d00",
            background: "linear-gradient(120deg,#ff8c00 0%,#904d00 52%,#821dda 128%)",
            padding: "76px 56px",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -80,
              top: -80,
              width: 380,
              height: 380,
              background: "radial-gradient(circle, rgba(255,220,195,0.55), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", maxWidth: 660 }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffdcc3", marginBottom: 20 }}>
              The Hivig promise
            </div>
            <div style={{ fontWeight: 800, fontSize: 46, lineHeight: 1.06, letterSpacing: "-0.03em", color: "#fffaf7" }}>
              No vendor pays us. No hype survives us. Every verdict is one we&apos;d stake our own deploy on.
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
              <Link href="/subscribe" style={{ background: "#fffaf7", color: "#241912", fontWeight: 700, fontSize: 15, padding: "14px 26px", borderRadius: 8 }}>
                Subscribe to the dispatch →
              </Link>
              <Link href="/manifesto" style={{ border: "1px solid rgba(255,255,255,0.7)", color: "#fffaf7", fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 8 }}>
                See how we score
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <div style={{ background: "#241912", marginTop: 72, color: "#e7d3c5" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "56px 32px 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32 }}>
          <div>
            <Link href="/" style={{ display: "inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/hivig-logo.png" alt="Hivig" style={{ height: 30, width: "auto", borderRadius: 6, display: "block", marginBottom: 16 }} />
            </Link>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#a58b78", maxWidth: "34ch", margin: 0 }}>
              Independent intelligence on agentic AI. Written for the people who build it and the people who buy it.
            </p>
          </div>
          <FooterCol
            title="Read"
            items={[
              { label: "Intel", href: "/intel" },
              { label: "Reviews", href: "/intel" },
              { label: "The Race", href: "/race" },
              { label: "Agent Store", href: "/agents" },
            ]}
          />
          <FooterCol
            title="Hivig"
            items={[
              { label: "Manifesto", href: "/manifesto" },
              { label: "How we score", href: "/manifesto" },
              { label: "About", href: "/about" },
              { label: "Consultancy", href: "/consultancy" },
            ]}
          />
          <FooterCol
            title="Follow"
            items={[
              { label: "Newsletter", href: "/subscribe" },
              // No real RSS feed or social handles exist yet — left as plain
              // text rather than fabricated links.
              { label: "RSS" },
              { label: "LinkedIn" },
              { label: "X" },
            ]}
          />
        </div>
        <div style={{ borderTop: "1px solid #564334" }}>
          <div
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              padding: "20px 32px",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              color: "#a58b78",
            }}
          >
            <span>© 2026 Hivig · Hi-Tech Vigilance</span>
            <span>Independent since day one</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href?: string }[] }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#ffb77d", marginBottom: 14 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 2.2 }}>
        {items.map((item, i) => (
          <span key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
            {i < items.length - 1 ? <br /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
