import { Card } from "@hivig/design-system";

export function Default() {
  return (
    <Card>
      <div style={{ fontFamily: "var(--hvg-font-display)", fontWeight: 600, fontSize: 15 }}>Race Tracker</div>
      <div style={{ fontFamily: "var(--hvg-font-display)", fontSize: 13, color: "var(--hvg-text-muted)", marginTop: 4 }}>
        342 models tracked, updated weekly.
      </div>
    </Card>
  );
}

export function Compact() {
  return (
    <Card padding="sm">
      <span style={{ fontFamily: "var(--hvg-font-mono)", fontSize: 11, color: "var(--hvg-text-muted)" }}>COMPACT PADDING</span>
    </Card>
  );
}

export function Spacious() {
  return (
    <Card padding="lg">
      <span style={{ fontFamily: "var(--hvg-font-mono)", fontSize: 11, color: "var(--hvg-text-muted)" }}>SPACIOUS PADDING</span>
    </Card>
  );
}
