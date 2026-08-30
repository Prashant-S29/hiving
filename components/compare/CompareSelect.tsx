"use client";

// components/compare/CompareSelect.tsx
//
// Wraps a real native <select>/<option> — no dropdown/select component
// exists anywhere in this codebase to follow instead (checked before
// building this), and this matches the design system's own philosophy of
// wrapping a plain form element (Input wraps a plain <input>) rather than
// building a from-scratch listbox. Styled with --hvg-* tokens per the
// Signal Room skill's "never a hardcoded color" rule.

export interface CompareSelectOption {
  value: string;
  label: string;
}

interface CompareSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CompareSelectOption[];
  placeholder: string;
  disabled?: boolean;
}

export function CompareSelect({ label, value, onChange, options, placeholder, disabled }: CompareSelectProps) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
      <span
        style={{
          fontFamily: "var(--hvg-font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--hvg-text-dim)",
        }}
      >
        {label}
      </span>
      <span style={{ position: "relative", display: "block" }}>
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            background: disabled ? "var(--hvg-surface-container)" : "var(--hvg-surface)",
            color: value ? "var(--hvg-text-primary)" : "var(--hvg-text-muted)",
            border: "1px solid var(--hvg-border-strong)",
            borderRadius: "var(--hvg-radius-md)",
            padding: "10px 32px 10px 12px",
            fontFamily: "var(--hvg-font-display)",
            fontSize: 14,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--hvg-text-muted)",
            fontSize: 10,
          }}
        >
          ▾
        </span>
      </span>
    </label>
  );
}
