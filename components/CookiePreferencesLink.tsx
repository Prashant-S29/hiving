"use client";

import { OPEN_PREFERENCES_EVENT } from "@/lib/consent";

// A single-purpose client component so Footer itself can stay a server
// component, only this link needs an onClick handler to dispatch the
// "open preferences" event CookieConsent listens for.
export default function CookiePreferencesLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT))}
      className="text-[13px] text-muted hover:text-ink transition-colors text-left"
    >
      {label}
    </button>
  );
}
