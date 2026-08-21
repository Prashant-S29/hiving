import "./StatCard.css";

export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  /** Small status dot color — sage for healthy/growing, warning/danger for attention states. */
  statusColor?: "sage" | "warning" | "danger";
}

/** Single-metric summary card, e.g. "Models tracked" or "Cameras online". */
export function StatCard({ label, value, sublabel, statusColor = "sage" }: StatCardProps) {
  return (
    <div className="hvg-statcard">
      <div className="hvg-statcard__head">
        <span className="hvg-statcard__label">{label}</span>
        <span className={`hvg-statcard__dot hvg-statcard__dot--${statusColor}`} />
      </div>
      <span className="hvg-statcard__value">{value}</span>
      {sublabel ? <span className="hvg-statcard__sub">{sublabel}</span> : null}
    </div>
  );
}
