// components/signal/SignalPageShell.tsx
//
// Shared page-level wrapper for anything migrated to the Signal Room design
// system (@hivig/design-system). Not a shipped component from that package —
// this repo's own "page shell," since the package doesn't ship one. Imports
// the stylesheet once per page (scoped here, not in the root layout — see
// .claude/skills/hivig-signal-room/SKILL.md) and applies the paper
// background + the body font (Inter) to everything inside it; headings pick up Geist from the global h1-h6 rule.

import "@hivig/design-system/styles.css";

export default function SignalPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="hvg-scope min-h-screen pt-32 pb-24 px-6 md:px-12"
      style={{ background: "var(--hvg-paper)", fontFamily: "var(--hvg-font-body)" }}
    >
      {children}
    </div>
  );
}
