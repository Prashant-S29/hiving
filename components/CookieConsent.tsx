"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/sanity/siteSettings";
import {
  readConsent,
  writeConsent,
  OPEN_PREFERENCES_EVENT,
  type ConsentCategory,
} from "@/lib/consent";

type ToggleState = Record<ConsentCategory, boolean>;

const DEFAULT_TOGGLES: ToggleState = { analytics: false, functional: false };

export default function CookieConsent({ copy }: { copy: SiteSettings["cookieConsent"] }) {
  // null until the first client-side check runs, so server and client
  // render the same (nothing) on first paint, no hydration mismatch.
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toggles, setToggles] = useState<ToggleState>(DEFAULT_TOGGLES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setBannerVisible(true);
    } else {
      setToggles({ analytics: existing.analytics, functional: existing.functional });
    }
    setReady(true);

    function openFromElsewhere() {
      const current = readConsent();
      setToggles(current ? { analytics: current.analytics, functional: current.functional } : DEFAULT_TOGGLES);
      setModalOpen(true);
    }
    window.addEventListener(OPEN_PREFERENCES_EVENT, openFromElsewhere);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openFromElsewhere);
  }, []);

  function acceptAll() {
    writeConsent({ analytics: true, functional: true });
    setBannerVisible(false);
    setModalOpen(false);
  }

  function rejectNonEssential() {
    writeConsent({ analytics: false, functional: false });
    setBannerVisible(false);
    setModalOpen(false);
  }

  function openPreferences() {
    setToggles(DEFAULT_TOGGLES);
    setModalOpen(true);
  }

  function savePreferences() {
    writeConsent(toggles);
    setBannerVisible(false);
    setModalOpen(false);
  }

  if (!ready) return null;

  return (
    <>
      {bannerVisible && !modalOpen && (
        <div
          role="region"
          aria-label={copy.regionAriaLabel}
          className="fixed bottom-0 left-0 right-0 z-50 bg-void border-t-2 border-signal px-6 md:px-12 py-6"
        >
          <div className="max-w-content mx-auto flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
            <p className="font-body text-[13px] leading-[1.7] text-ink/70 flex-1">
              {copy.bannerIntro}{" "}
              <Link href="/legal/privacy" className="text-signal hover:underline">
                {copy.privacyLinkLabel}
              </Link>{" "}
              {copy.bannerOutro}
            </p>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={openPreferences}
                className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted hover:text-ink border border-rule-strong px-5 py-3 transition-colors"
              >
                {copy.manageLabel}
              </button>
              <button
                onClick={rejectNonEssential}
                className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink border border-rule-strong hover:border-ink px-5 py-3 transition-colors"
              >
                {copy.rejectLabel}
              </button>
              <button
                onClick={acceptAll}
                className="bg-signal hover:bg-signal-dark text-white font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-5 py-3 transition-colors"
              >
                {copy.acceptLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          className="fixed inset-0 z-[60] bg-void/80 flex items-center justify-center p-6"
        >
          <div className="bg-void border border-rule-strong max-w-[540px] w-full p-8 md:p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 id="cookie-preferences-title" className="font-serif text-[24px] font-bold tracking-tight">
                {copy.modalTitle}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                aria-label={copy.closeLabel}
                className="text-muted hover:text-ink text-[20px] leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 mb-8">
              <ConsentRow
                title={copy.necessary.title}
                description={copy.necessary.description}
                checked
                disabled
              />
              <ConsentRow
                title={copy.analytics.title}
                description={copy.analytics.description}
                checked={toggles.analytics}
                onChange={(v) => setToggles((t) => ({ ...t, analytics: v }))}
              />
              <ConsentRow
                title={copy.functional.title}
                description={copy.functional.description}
                checked={toggles.functional}
                onChange={(v) => setToggles((t) => ({ ...t, functional: v }))}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={savePreferences}
                className="bg-signal hover:bg-signal-dark text-white font-mono text-[11px] tracking-[0.1em] uppercase font-medium px-6 py-3 transition-colors"
              >
                {copy.saveLabel}
              </button>
              <button
                onClick={rejectNonEssential}
                className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink border border-rule-strong hover:border-ink px-6 py-3 transition-colors"
              >
                {copy.rejectLabel}
              </button>
              <button
                onClick={acceptAll}
                className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted hover:text-ink border border-rule-strong px-6 py-3 transition-colors"
              >
                {copy.acceptLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ConsentRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 pb-5 border-b border-rule">
      <div className="flex-1">
        <h3 className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-ink mb-1.5">{title}</h3>
        <p className="font-body text-[13px] leading-[1.6] text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 mt-0.5 rounded-full transition-colors ${
          checked ? "bg-signal" : "bg-dim"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
