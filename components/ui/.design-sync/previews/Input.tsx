import { Input } from "@hivig/design-system";

export function Default() {
  return <Input label="Agent description" defaultValue="Customer support triage bot" readOnly />;
}

export function Focused() {
  return <Input label="Agent description" defaultValue="Customer support triage bot" autoFocus />;
}

export function WithError() {
  return <Input label="Agent description" placeholder="At least 10 characters" error="Required — please describe your agent" />;
}
