import "./Badge.css";

export type BadgeStatus = "verified" | "in-review" | "unverified" | "disputed";

export interface BadgeProps {
  /** Maps 1:1 to Hivig's `verificationStatus` field on race entries. */
  status: BadgeStatus;
  /** Override the label shown; defaults to a human label for `status`. */
  label?: string;
}

const DEFAULT_LABEL: Record<BadgeStatus, string> = {
  verified: "Verified",
  "in-review": "In review",
  unverified: "Unverified",
  disputed: "Disputed",
};

/** Status chip for race-entry verification state. Verified carries a check mark instead of a dot. */
export function Badge({ status, label }: BadgeProps) {
  return (
    <span className={`hvg-badge hvg-badge--${status}`}>
      {status === "verified" ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l5 5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="hvg-badge__dot" aria-hidden="true" />
      )}
      {label ?? DEFAULT_LABEL[status]}
    </span>
  );
}
