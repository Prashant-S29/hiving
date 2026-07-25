import Link from "next/link";
import type { HeroChoice } from "@/lib/types";

// Shared by InteractiveHero (canvas variant) and the image/video hero
// fallbacks in app/page.tsx, so the actual clickable choices look and behave
// identically no matter which media style is selected in the CMS.

export const ACCENT_STYLES: Record<HeroChoice["accent"], { border: string; text: string; glow: string }> = {
  signal: {
    border: "hover:border-signal focus-visible:border-signal",
    text: "text-signal",
    glow: "hover:shadow-[0_0_40px_-12px_rgba(214,59,47,0.6)]",
  },
  verify: {
    border: "hover:border-verify focus-visible:border-verify",
    text: "text-verify",
    glow: "hover:shadow-[0_0_40px_-12px_rgba(30,158,86,0.6)]",
  },
  amber: {
    border: "hover:border-amber focus-visible:border-amber",
    text: "text-amber",
    glow: "hover:shadow-[0_0_40px_-12px_rgba(201,125,16,0.6)]",
  },
};

export default function HeroChoiceCards({ choices }: { choices: HeroChoice[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {choices.map((choice) => {
        const accent = ACCENT_STYLES[choice.accent];
        return (
          <Link
            key={choice.href}
            href={choice.href}
            className={`group block border border-rule-strong bg-surface/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${accent.border} ${accent.glow}`}
          >
            <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${accent.text}`}>Choose</span>
            <h3 className="mt-2 font-serif text-xl font-bold text-ink">{choice.label}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink/65">{choice.description}</p>
            <span
              className={`mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.1em] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${accent.text}`}
            >
              Go →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
