// components/compare/VerdictBadge.tsx
//
// Page-local — the shipped @hivig/design-system Badge component is hard-scoped
// to the real verificationStatus values (verified/in-review/unverified/
// disputed) and shouldn't be repurposed for a semantically different concept.
// See lib/compare-verdicts.ts for how these are computed.

import type { VerdictTag } from "@/lib/compare-verdicts";

export function VerdictBadge({ tag }: { tag: VerdictTag }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: "var(--hvg-radius-full)",
        background: "var(--hvg-ember-soft)",
        border: "1px solid rgba(255, 140, 0, 0.4)",
        color: "var(--hvg-ember-strong)",
        fontFamily: "var(--hvg-font-mono)",
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true">{tag.icon}</span>
      {tag.label}
    </span>
  );
}
