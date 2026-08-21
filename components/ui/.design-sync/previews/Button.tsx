import { Button } from "@hivig/design-system";

export function Primary() {
  return <Button variant="primary">Get my quote</Button>;
}

export function Secondary() {
  return <Button variant="secondary">View leaderboard</Button>;
}

export function Ghost() {
  return <Button variant="ghost">Dismiss</Button>;
}

export function Destructive() {
  return <Button variant="destructive">Flag for review</Button>;
}

export function Disabled() {
  return (
    <Button variant="primary" disabled>
      Get my quote
    </Button>
  );
}
