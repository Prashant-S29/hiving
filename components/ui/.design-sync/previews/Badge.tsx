import { Badge } from "@hivig/design-system";

export function AllStatuses() {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      <Badge status="verified" />
      <Badge status="in-review" />
      <Badge status="unverified" />
      <Badge status="disputed" />
    </div>
  );
}

export function CustomLabel() {
  return <Badge status="verified" label="Verified 2026-08-14" />;
}
