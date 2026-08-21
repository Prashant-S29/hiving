import { Nav } from "@hivig/design-system";

const links = [
  { label: "Race", href: "/race", active: true },
  { label: "Agents", href: "/agents" },
  { label: "Pricing", href: "/agents/pricing" },
  { label: "Discover", href: "/agents/discover" },
];

export function Default() {
  return <Nav links={links} statusLabel="Tracking live" avatarInitials="AS" />;
}

export function AgentsActive() {
  return (
    <Nav
      links={links.map((l) => ({ ...l, active: l.href === "/agents" }))}
      statusLabel="Tracking live"
      avatarInitials="AS"
    />
  );
}
