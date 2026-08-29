"use client";

// components/compare/CompareModelPicker.tsx — Steps 1-2 of the spec: up to 4
// model slots (provider → model cascade) plus the "what's the job?" select.
//
// The only client-navigation pattern this page introduces to the codebase
// (no useSearchParams/useRouter exists elsewhere here — see the /compare
// build plan). Kept to exactly this one submit handler; it ends in a real
// navigation to a plain server-searchParams route, same as every other
// URL-state page here, not a client fetch.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@hivig/design-system";
import { CompareSelect } from "@/components/compare/CompareSelect";
import type { CompareJobOption } from "@/lib/sanity/compare";

interface Provider {
  id: string;
  name: string;
}

interface ProviderModel {
  slug: string;
  name: string;
}

interface Slot {
  providerId: string;
  modelSlug: string;
}

const MAX_SLOTS = 4;
const MIN_SLOTS_TO_COMPARE = 2;

export interface CompareModelPickerProps {
  providers: Provider[];
  modelsByProvider: Record<string, ProviderModel[]>;
  jobOptions: CompareJobOption[];
  heroEyebrow: string;
  heroHeading: string;
  heroSubhead: string;
  addModelLabel: string;
  providerLabel: string;
  modelLabel: string;
  jobLabel: string;
  compareButtonLabel: string;
  emptyStateLabel: string;
  initialSlots?: Slot[];
  initialJob?: string;
}

export function CompareModelPicker({
  providers,
  modelsByProvider,
  jobOptions,
  heroEyebrow,
  heroHeading,
  heroSubhead,
  addModelLabel,
  providerLabel,
  modelLabel,
  jobLabel,
  compareButtonLabel,
  emptyStateLabel,
  initialSlots,
  initialJob,
}: CompareModelPickerProps) {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>(initialSlots?.length ? initialSlots : [{ providerId: "", modelSlug: "" }]);
  const [job, setJob] = useState(initialJob || "");

  const validSlots = slots.filter((s) => s.providerId && s.modelSlug);
  const canCompare = validSlots.length >= MIN_SLOTS_TO_COMPARE;

  function updateSlot(index: number, patch: Partial<Slot>) {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addSlot() {
    setSlots((prev) => (prev.length < MAX_SLOTS ? [...prev, { providerId: "", modelSlug: "" }] : prev));
  }

  function removeSlot(index: number) {
    setSlots((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canCompare) return;
    const qs = new URLSearchParams();
    qs.set("models", validSlots.map((s) => s.modelSlug).join(","));
    if (job) qs.set("job", job);
    router.push(`/compare?${qs.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[1100px]">
      <div className="mb-8 max-w-2xl">
        <div
          className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: "var(--hvg-ember-strong)", fontFamily: "var(--hvg-font-mono)" }}
        >
          {heroEyebrow}
        </div>
        <h1 className="text-[32px] font-bold leading-[1.1] md:text-[44px]" style={{ color: "var(--hvg-text-primary)" }}>
          {heroHeading}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7]" style={{ color: "var(--hvg-text-secondary)" }}>
          {heroSubhead}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {slots.map((slot, i) => {
          const providerModels = slot.providerId ? modelsByProvider[slot.providerId] || [] : [];
          return (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-[var(--hvg-radius-lg)] border p-4"
              style={{ background: "var(--hvg-surface)", borderColor: "var(--hvg-border)", boxShadow: "var(--hvg-shadow-card)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
                  Model {i + 1}
                </span>
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(i)}
                    aria-label={`Remove model ${i + 1}`}
                    style={{ color: "var(--hvg-text-muted)", fontSize: 12, background: "none", border: "none", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <CompareSelect
                label={providerLabel}
                value={slot.providerId}
                onChange={(providerId) => updateSlot(i, { providerId, modelSlug: "" })}
                options={providers.map((p) => ({ value: p.id, label: p.name }))}
                placeholder={emptyStateLabel}
              />
              <CompareSelect
                label={modelLabel}
                value={slot.modelSlug}
                onChange={(modelSlug) => updateSlot(i, { modelSlug })}
                options={providerModels.map((m) => ({ value: m.slug, label: m.name }))}
                placeholder={slot.providerId ? "Select a model" : "Pick a provider first"}
                disabled={!slot.providerId}
              />
            </div>
          );
        })}

        {slots.length < MAX_SLOTS && (
          <button
            type="button"
            onClick={addSlot}
            className="flex min-h-[168px] flex-col items-center justify-center gap-2 rounded-[var(--hvg-radius-lg)] border border-dashed transition-colors"
            style={{ borderColor: "var(--hvg-border-strong)", color: "var(--hvg-text-muted)" }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border text-lg"
              style={{ borderColor: "var(--hvg-border-strong)" }}
              aria-hidden="true"
            >
              +
            </span>
            <span className="text-[13px] font-medium">{addModelLabel}</span>
          </button>
        )}
      </div>

      <div
        className="mt-6 flex flex-col items-stretch gap-4 rounded-[var(--hvg-radius-lg)] border p-4 sm:flex-row sm:items-end sm:justify-between"
        style={{ background: "var(--hvg-surface-container)", borderColor: "var(--hvg-border)" }}
      >
        <div className="sm:max-w-sm">
          <CompareSelect
            label={jobLabel}
            value={job}
            onChange={setJob}
            options={jobOptions}
            placeholder="General / Not sure yet"
          />
        </div>
        <Button type="submit" disabled={!canCompare} size="md">
          {compareButtonLabel}
        </Button>
      </div>
    </form>
  );
}
