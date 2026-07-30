// Cookie consent storage + a tiny event bus. Deliberately framework-free
// (no React here) so anything, a future analytics script, a server
// component's client wrapper, the footer link, can read/trigger consent
// without importing UI code. This is the one file that changes if the
// storage mechanism or expiry rule ever changes.

export type ConsentCategory = "analytics" | "functional";

export interface ConsentRecord {
  analytics: boolean;
  functional: boolean;
  timestamp: string; // ISO 8601
}

const STORAGE_KEY = "hivig-cookie-consent";
const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000; // 12 months, per spec

// Fired on window whenever consent is saved. A future analytics script
// (or anything else) can `window.addEventListener(CONSENT_CHANGED_EVENT, ...)`
// instead of polling localStorage.
export const CONSENT_CHANGED_EVENT = "hivig-consent-changed";

// Fired to request the preference modal open, without the trigger (e.g.
// the footer link) needing any React state/context wiring to the banner.
export const OPEN_PREFERENCES_EVENT = "hivig-open-cookie-preferences";

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    const age = Date.now() - new Date(parsed.timestamp).getTime();
    if (Number.isNaN(age) || age > CONSENT_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; functional: boolean }): ConsentRecord {
  const record: ConsentRecord = { ...choice, timestamp: new Date().toISOString() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: record }));
  }
  return record;
}

// Convenience check for gating scripts, e.g.:
//   if (hasConsent("analytics")) { loadAnalyticsScript(); }
export function hasConsent(category: ConsentCategory): boolean {
  return readConsent()?.[category] === true;
}
