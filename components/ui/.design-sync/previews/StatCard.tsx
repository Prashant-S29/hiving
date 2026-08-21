import { StatCard } from "@hivig/design-system";

export function ModelsTracked() {
  return <StatCard label="Models tracked" value={342} sublabel="+18 new entries this week · updates Sun 00:00 UTC" statusColor="sage" />;
}

export function NeedsAttention() {
  return <StatCard label="Disputed entries" value={3} sublabel="Awaiting review from the tracking team" statusColor="warning" />;
}
