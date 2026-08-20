"use client";

// components/RaceHero.tsx
//
// Visual hero for /race: an animated track with markers for the current top
// 4 models continuously traveling the loop, a "Live Leaderboard" list panel,
// and a "Disclaimer" drawer explaining the real Hivig Velocity Index.
// Migrated from an earlier scaffold's design-mockup-driven build; adapted
// here to this repo's real Sanity-backed data model (RaceModel/
// RaceSettingsContent from lib/sanity/race.ts) instead of a local JSON file —
// every piece of copy comes from `copy` (the raceSettings CMS singleton,
// with code-level fallbacks in DEFAULT_RACE_SETTINGS), and `race_score` comes
// from the aiModel documents' automated Velocity Index fields (see
// sanity/schemaTypes/documents/raceData.ts, scripts/fetch-race-metrics.ts).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CmsLink from "./CmsLink";
import type { RaceModel, RaceSettingsContent } from "@/lib/sanity/race";
import { rankDelta } from "@/lib/race-rank-delta";

interface RaceHeroProps {
  topModels: RaceModel[]; // real, already rank-sorted models
  weekLabel: string; // e.g. "W34 · 2026"
  copy: RaceSettingsContent;
}

type Accent = "signal" | "verify" | "amber";

// Cycles through the brand's 3 accent colors only — no blue/purple, this
// site's palette is deliberately signal/amber/verify (see tailwind.config.ts).
const ACCENTS: Accent[] = ["signal", "verify", "amber", "signal"];
const ACCENT_TEXT: Record<Accent, string> = {
  signal: "text-signal",
  verify: "text-verify",
  amber: "text-amber",
};
const ACCENT_BG: Record<Accent, string> = {
  signal: "bg-signal",
  verify: "bg-verify",
  amber: "bg-amber",
};
const ACCENT_BORDER: Record<Accent, string> = {
  signal: "border-signal/60",
  verify: "border-verify/50",
  amber: "border-amber/50",
};
const ACCENT_GLOW: Record<Accent, string> = {
  signal: "0 0 16px 4px rgba(214,59,47,.55)",
  verify: "0 0 16px 4px rgba(30,158,86,.55)",
  amber: "0 0 16px 4px rgba(201,125,16,.55)",
};

// Initial progress (0–1) along the loop for each marker — staggers the
// "pack" instead of bunching all 4 markers at the same point.
const START_PROGRESS = [0.585, 0.54, 0.495, 0.45];
const LAP_MS = 52000;

const TRACK_PATH =
  "M455 110 C520 90 560 150 610 190 C700 250 690 330 770 345 C900 365 980 300 1090 260 C1180 232 1230 205 1300 215 C1360 223 1410 265 1400 315 C1392 355 1345 360 1305 335 C1255 302 1240 320 1200 355 C1120 420 1010 480 900 470 C820 462 790 405 720 395 C560 378 430 360 330 380 C285 388 268 430 262 480 C255 545 235 600 185 605 C150 608 138 560 148 505 C156 460 195 430 250 415 C300 402 330 360 350 300 C375 225 400 150 455 110 Z";

export default function RaceHero({ topModels, weekLabel, copy }: RaceHeroProps) {
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

  // Continuously moves each marker around the track loop by walking the
  // SVG path's real geometry (getPointAtLength) — not a CSS animation,
  // since the path is an irregular loop, not a simple shape.
  //
  // Reads marker elements straight from the live DOM (querySelectorAll on a
  // container ref, via a stable data-marker-index attribute) rather than a
  // per-item array of inline ref callbacks — inline ref callbacks
  // (`ref={(el) => markerRefs.current[i] = el}`) never reliably populated
  // before this effect ran in an earlier version of this component.
  // Querying the container after commit sidesteps that class of timing bug.
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

    // Place synchronously on every effect run, before anything async — a
    // version of this that only ever positioned markers inside the rAF
    // callback left them stuck at their default (0,0) CSS position whenever
    // that first callback never got a chance to fire before React 18 Strict
    // Mode's dev-only mount→cleanup→remount cycle tore the effect down.
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
    <div className="relative flex min-h-[560px] flex-col overflow-hidden border border-rule bg-gradient-to-b from-surface/70 to-deep/90 p-8 md:min-h-[660px] md:p-11">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--color-signal),0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-signal),0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(80% 70% at 50% 45%, #000 30%, transparent 78%)",
        }}
      />

      {/* Full-bleed track background — spans almost the entire hero card behind
          everything else. Markers live in this same box so their
          percentage-based position lines up with the visible curve. */}
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
            <path ref={pathRef} id="hvTrack" d={TRACK_PATH} />
          </defs>
          <use href="#hvTrack" className="stroke-void" strokeWidth={34} fill="none" strokeLinejoin="round" transform="translate(0 12)" />
          <use href="#hvTrack" className="stroke-surface" strokeWidth={30} fill="none" strokeLinejoin="round" />
          <use href="#hvTrack" className="stroke-rule-strong" strokeWidth={1.4} fill="none" />
          <use
            href="#hvTrack"
            className={`stroke-signal ${reducedMotion ? "" : "animate-race-flow"}`}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="34 42"
          />
        </svg>

        {/* Traveling markers */}
        {cards.map((m, i) => {
          const accent = ACCENTS[i];
          return (
            <div key={m.slug} data-marker-index={i} className="absolute left-0 top-0 z-[3] will-change-transform">
              <div
                className={`absolute left-0 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${ACCENT_BG[accent]} ${reducedMotion ? "" : "animate-blink"}`}
                style={{ boxShadow: ACCENT_GLOW[accent] }}
              />
              <Link
                href={`/race/models/${m.slug}`}
                className={`pointer-events-auto absolute left-0 top-0 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap border bg-deep/90 px-3 py-2 backdrop-blur-sm transition-transform hover:-translate-y-0.5 ${ACCENT_BORDER[accent]}`}
                style={{ transform: "translate(-50%, calc(-50% - 46px))" }}
              >
                <span className={`font-serif text-[11px] font-extrabold ${ACCENT_TEXT[accent]}`}>#{m.rank_current}</span>
                <span className="flex flex-col leading-tight">
                  <span className="font-sans text-[13px] font-bold text-ink">{m.model_name}</span>
                  <span className="text-[10px] tracking-wide text-muted">{m.org_name}</span>
                </span>
                <span className={`px-2 py-0.5 font-mono text-[13px] font-semibold text-white ${ACCENT_BG[accent]}`}>
                  {m.race_score != null ? m.race_score.toFixed(1) : "—"}
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* header row */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-6 border-b border-rule pb-6">
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-signal">
            <span className={`h-2 w-2 rounded-full bg-signal ${reducedMotion ? "" : "animate-blink"}`} />
            {copy.heroEyebrow}
          </div>
          <h1 className="font-serif text-[34px] md:text-[52px] font-bold leading-[0.98] tracking-tight text-ink">
            {copy.heroHeadingLead}
            <br /> scored in <span className="italic text-signal">{copy.heroHeadingEmphasis}</span>.
          </h1>
          <p className="mt-3 max-w-md font-body text-[15px] leading-[1.6] text-muted">{copy.heroSubhead}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">{copy.heroTrackingWeekLabel}</div>
          <div className="font-mono text-2xl font-semibold text-ink">{weekLabel}</div>
          <div className="mt-1 font-mono text-[11px] text-dim">{copy.heroNextUpdateLabel}</div>
        </div>
      </div>

      {/* Live Leaderboard panel — floats centered over the visible track background */}
      <div className="relative z-10 flex flex-1 items-center py-6">
        {cards.length === 0 ? (
          <div className="font-mono text-xs uppercase tracking-wider text-muted">{copy.heroEmptyStateLabel}</div>
        ) : (
          <div className="w-full max-w-[520px] border border-rule-strong bg-deep/75 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" style={{ boxShadow: "0 0 12px rgb(var(--color-signal))" }} />
                {copy.heroLeaderboardLabel}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{copy.heroScoreUnitLabel}</div>
            </div>
            <div className="flex flex-col">
              {cards.map((m, i) => {
                const accent = ACCENTS[i];
                const delta = rankDelta(m, copy.newRankLabel);
                return (
                  <Link
                    key={m.slug}
                    href={`/race/models/${m.slug}`}
                    className="grid grid-cols-[30px_1fr_auto_auto] items-center gap-3 border-b border-rule px-4 py-3 transition-colors last:border-b-0 hover:bg-surface/50"
                  >
                    <span className={`font-serif text-[15px] font-extrabold ${i === 0 ? ACCENT_TEXT[accent] : "text-ink"}`}>{m.rank_current}</span>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${ACCENT_BG[accent]}`} style={{ boxShadow: ACCENT_GLOW[accent] }} />
                      <span className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate font-sans text-[13px] font-bold text-ink">{m.model_name}</span>
                        <span className="text-[10px] tracking-wide text-muted">{m.org_name}</span>
                      </span>
                    </span>
                    <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${delta.className}`}>
                      {delta.symbol} {delta.label}
                    </span>
                    <span className="min-w-[50px] text-right font-mono text-[15px] font-semibold text-ink">
                      {m.race_score != null ? m.race_score.toFixed(1) : "—"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* disclaimer button */}
      <div className="relative z-10 mt-auto">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-3 border border-rule-strong bg-surface/60 px-4 py-3 text-left font-body text-[13px] text-ink/80 backdrop-blur-sm transition-colors hover:border-signal/50 hover:text-ink"
        >
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center bg-signal font-mono text-xs font-bold text-white">i</span>
          <span>{copy.heroDisclaimerButtonLabel}</span>
          <span className="text-signal">→</span>
        </button>
      </div>

      {/* disclaimer drawer — compact floating panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-void/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="fixed right-6 top-6 z-50 flex max-h-[calc(100vh-3rem)] w-full max-w-[380px] flex-col overflow-hidden border border-rule-strong bg-deep shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-signal font-mono text-xs font-bold text-white">i</span>
                <h2 className="font-serif text-base font-bold text-ink">{copy.heroDisclaimerTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-rule-strong text-muted transition-colors hover:border-signal hover:bg-signal hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <p className="font-body text-[13px] leading-[1.7] text-ink/75">
                {copy.heroDisclaimerBody}{" "}
                <CmsLink link={copy.methodologyAction} className="text-signal transition-colors hover:text-ink">
                  {copy.heroDisclaimerLinkLabel} →
                </CmsLink>
              </p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
