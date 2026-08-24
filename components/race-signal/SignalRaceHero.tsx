"use client";

// components/race-signal/SignalRaceHero.tsx
//
// Race Hero rebuilt on the new "Hivig Signal Room" design system
// (@hivig/design-system — see components/ui/.design-sync/conventions.md).
// This is a pilot: only the Race page (and, next, Agent Store) moves to the
// new light palette for now — the rest of the site stays on the existing
// dark-editorial tokens in components/RaceHero.tsx, which this does NOT
// replace or modify.
//
// Keeps the proven traveling-marker track animation (SVG path geometry via
// getPointAtLength — see components/RaceTrack.tsx's history for the bugs
// already fixed there) but re-skins every color via --hvg-* tokens instead
// of the old signal/verify/amber tokens, and uses the real shipped
// LeaderboardCard component for the leaderboard list instead of a bespoke
// styled list.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, LeaderboardCard } from "@hivig/design-system";
import "@hivig/design-system/styles.css";
import type { RaceModel, RaceSettingsContent } from "@/lib/sanity/race";

interface SignalRaceHeroProps {
  topModels: RaceModel[];
  weekLabel: string;
  copy: RaceSettingsContent;
}

// Rotates through the system's 3 accents for the traveling markers only —
// LeaderboardCard itself is accent-neutral (ember-only), this rotation is
// just to keep the 4 track pins visually distinct at a glance.
const ACCENT_VARS = ["--hvg-ember", "--hvg-clay", "--hvg-sage", "--hvg-ember"];
// Ember is Orbit's orange — too light for white text to clear WCAG contrast
// (~2.3:1, needs 4.5:1). Clay and sage are dark/muted enough that white text
// still clears it.
const ACCENT_SCORE_TEXT: Record<string, string> = {
  "--hvg-ember": "#241912",
  "--hvg-clay": "#fff8f1",
  "--hvg-sage": "#fff8f1",
};

const START_PROGRESS = [0.585, 0.54, 0.495, 0.45];
const LAP_MS = 52000;

const TRACK_PATH =
  "M455 110 C520 90 560 150 610 190 C700 250 690 330 770 345 C900 365 980 300 1090 260 C1180 232 1230 205 1300 215 C1360 223 1410 265 1400 315 C1392 355 1345 360 1305 335 C1255 302 1240 320 1200 355 C1120 420 1010 480 900 470 C820 462 790 405 720 395 C560 378 430 360 330 380 C285 388 268 430 262 480 C255 545 235 600 185 605 C150 608 138 560 148 505 C156 460 195 430 250 415 C300 402 330 360 350 300 C375 225 400 150 455 110 Z";

function orgInitials(orgName: string): string {
  const words = orgName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function SignalRaceHero({ topModels, weekLabel, copy }: SignalRaceHeroProps) {
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const markersContainerRef = useRef<HTMLDivElement>(null);

  const cards = topModels.slice(0, 4);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const path = pathRef.current;
    const container = markersContainerRef.current;
    if (!path || !container || cards.length === 0) return;
    const total = path.getTotalLength();
    const markerEls = Array.from(container.querySelectorAll<HTMLDivElement>("[data-marker-index]"));

    function place(dt: number) {
      markerEls.forEach((el, i) => {
        const p0 = START_PROGRESS[i] ?? i / markerEls.length;
        const prog = (((p0 + dt) % 1) + 1) % 1;
        const pt = path!.getPointAtLength(prog * total);
        el.style.left = (pt.x / 1500) * 100 + "%";
        el.style.top = (pt.y / 900) * 100 + "%";
      });
    }

    // Place synchronously before anything async — see components/RaceHero.tsx
    // for why (Strict Mode's dev-only mount/cleanup/remount can tear the
    // effect down before the first rAF callback ever fires).
    place(0);

    if (reducedMotion) return;

    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      place((now - start) / LAP_MS);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cards.length, reducedMotion]);

  return (
    <div
      className="hvg-scope relative flex min-h-[560px] flex-col overflow-hidden rounded-[var(--hvg-radius-lg)] border p-8 md:min-h-[660px] md:p-11"
      style={{
        background: "var(--hvg-paper)",
        borderColor: "var(--hvg-border)",
        boxShadow: "var(--hvg-shadow-card)",
        fontFamily: "var(--hvg-font-display)",
      }}
    >
      {/* Full-bleed track background */}
      <div
        ref={markersContainerRef}
        className="pointer-events-none absolute z-0"
        style={{
          right: "-4%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "120%",
          aspectRatio: "1500 / 900",
          maskImage: "linear-gradient(90deg, transparent 3%, #000 32%, #000 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 3%, #000 32%, #000 100%)",
        }}
      >
        <svg viewBox="0 0 1500 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <path ref={pathRef} id="hvgTrack" d={TRACK_PATH} />
          </defs>
          <use href="#hvgTrack" stroke="var(--hvg-paper-dim)" strokeWidth={34} fill="none" strokeLinejoin="round" transform="translate(0 12)" />
          <use href="#hvgTrack" stroke="var(--hvg-surface-container)" strokeWidth={30} fill="none" strokeLinejoin="round" />
          <use href="#hvgTrack" stroke="var(--hvg-border-strong)" strokeWidth={1.4} fill="none" />
          <use
            href="#hvgTrack"
            stroke="var(--hvg-ember)"
            className={reducedMotion ? "" : "animate-race-flow"}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="34 42"
          />
        </svg>

        {cards.map((m, i) => {
          const accentVar = ACCENT_VARS[i];
          return (
            <div key={m.slug} data-marker-index={i} className="absolute left-0 top-0 z-[3] will-change-transform">
              <div
                className={`absolute left-0 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${reducedMotion ? "" : "animate-blink"}`}
                style={{ background: `var(${accentVar})`, boxShadow: `0 0 16px 4px var(${accentVar})` }}
              />
              <Link
                href={`/race/models/${m.slug}`}
                className="pointer-events-auto absolute left-0 top-0 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-[var(--hvg-radius-md)] border px-3 py-2 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                style={{
                  transform: "translate(-50%, calc(-50% - 46px))",
                  background: "var(--hvg-surface)",
                  borderColor: `var(${accentVar})`,
                  boxShadow: "var(--hvg-shadow-card)",
                }}
              >
                <span className="font-bold text-[11px]" style={{ color: `var(${accentVar})`, fontFamily: "var(--hvg-font-mono)" }}>
                  #{m.rank_current}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--hvg-text-primary)" }}>{m.model_name}</span>
                  <span className="text-[10px] tracking-wide" style={{ color: "var(--hvg-text-muted)" }}>{m.org_name}</span>
                </span>
                <span
                  className="rounded-[var(--hvg-radius-sm)] px-2 py-0.5 text-[13px] font-semibold"
                  style={{ background: `var(${accentVar})`, color: ACCENT_SCORE_TEXT[accentVar], fontFamily: "var(--hvg-font-mono)" }}
                >
                  {m.race_score != null ? m.race_score.toFixed(1) : "—"}
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* header row */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-6 border-b pb-6" style={{ borderColor: "var(--hvg-border)" }}>
        <div className="max-w-xl">
          <div
            className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--hvg-ember-strong)", fontFamily: "var(--hvg-font-mono)" }}
          >
            <span className={`h-2 w-2 rounded-full ${reducedMotion ? "" : "animate-blink"}`} style={{ background: "var(--hvg-ember)" }} />
            {copy.heroEyebrow}
          </div>
          <h1 className="text-[34px] md:text-[52px] font-bold leading-[1.02] tracking-tight" style={{ color: "var(--hvg-text-primary)" }}>
            {copy.heroHeadingLead}
            <br /> scored in <span style={{ color: "var(--hvg-ember)" }}>{copy.heroHeadingEmphasis}</span>.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-[1.6]" style={{ color: "var(--hvg-text-secondary)" }}>{copy.heroSubhead}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="mb-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
            {copy.heroTrackingWeekLabel}
          </div>
          <div className="text-2xl font-semibold" style={{ color: "var(--hvg-text-primary)", fontFamily: "var(--hvg-font-mono)" }}>{weekLabel}</div>
          <div className="mt-1 text-[11px]" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>{copy.heroNextUpdateLabel}</div>
        </div>
      </div>

      {/* Live Leaderboard — real LeaderboardCard components from the design system */}
      <div className="relative z-10 flex flex-1 items-center py-6">
        {cards.length === 0 ? (
          <div className="text-xs uppercase tracking-wider" style={{ color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>
            {copy.heroEmptyStateLabel}
          </div>
        ) : (
          <div className="grid w-full max-w-[420px] gap-3">
            <div
              className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}
            >
              <span>{copy.heroLeaderboardLabel}</span>
              <span>{copy.heroScoreUnitLabel}</span>
            </div>
            {cards.map((m, i) => (
              <Link key={m.slug} href={`/race/models/${m.slug}`} className="block transition-transform hover:-translate-y-0.5">
                <LeaderboardCard
                  rank={m.rank_current}
                  rankDelta={m.rank_previous_period != null ? m.rank_previous_period - m.rank_current : undefined}
                  modelName={m.model_name}
                  orgName={m.org_name}
                  orgInitials={orgInitials(m.org_name)}
                  country={m.org_country}
                  modelType={m.model_type}
                  hviScore={m.race_score ?? null}
                  live={i === 0}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* disclaimer trigger */}
      <div className="relative z-10 mt-auto">
        <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
          {copy.heroDisclaimerButtonLabel}
        </Button>
      </div>

      {/* disclaimer drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 backdrop-blur-sm" style={{ background: "rgba(22,17,11,0.5)" }} onClick={() => setOpen(false)} />
          <aside
            className="hvg-scope fixed right-6 top-6 z-50 flex max-h-[calc(100vh-3rem)] w-full max-w-[380px] flex-col overflow-hidden rounded-[var(--hvg-radius-lg)] border shadow-2xl"
            style={{ background: "var(--hvg-surface)", borderColor: "var(--hvg-border-strong)", fontFamily: "var(--hvg-font-display)" }}
          >
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4" style={{ borderColor: "var(--hvg-border)" }}>
              <h2 className="text-base font-bold" style={{ color: "var(--hvg-text-primary)" }}>{copy.heroDisclaimerTitle}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[var(--hvg-radius-sm)] border transition-colors"
                style={{ borderColor: "var(--hvg-border-strong)", color: "var(--hvg-text-muted)" }}
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <p className="text-[13px] leading-[1.7]" style={{ color: "var(--hvg-text-secondary)" }}>
                {copy.heroDisclaimerBody}{" "}
                <Link href="/race/methodology" style={{ color: "var(--hvg-ember)" }}>
                  {copy.heroDisclaimerLinkLabel} →
                </Link>
              </p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
