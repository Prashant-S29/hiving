import Link from "next/link";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";

export default function Footer() {
  return (
    <footer className="bg-void border-t-2 border-signal px-6 md:px-12 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-rule max-w-content mx-auto">
        <div>
          <div className="font-serif text-3xl mb-4">
            <span className="italic text-ink">Hi</span>
            <span className="font-bold text-signal">vig</span>
          </div>
          <p className="text-[13px] text-muted leading-7 max-w-[280px] mb-5">
            Hi-Tech Vigilance for the Agentic Age. Independent intelligence on
            autonomous AI systems — rigorous, platform-agnostic, and written
            for the people who build and lead.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="font-mono text-[10px] tracking-[0.1em] px-2.5 py-1 border border-signal text-signal">™ Registered</span>
            <span className="font-mono text-[10px] tracking-[0.1em] px-2.5 py-1 border border-signal text-signal">Type 42</span>
            <span className="font-mono text-[10px] tracking-[0.1em] px-2.5 py-1 border border-rule-strong text-muted">hivig.com</span>
          </div>
        </div>

        <FooterCol title="Editorial" links={[
          ["Deep Dives", "/intel"],
          ["How-To Guides", "/intel"],
          ["Watchdog Reports", "/intel"],
          ["Opinion", "/intel"],
        ]} />
        <FooterCol title="Company" links={[
          ["About Hivig", "/about"],
          ["Manifesto", "/manifesto"],
          ["Consultancy", "/consultancy"],
          ["Subscribe", "/subscribe"],
        ]} />
        <FooterCol
          title="Legal"
          links={[
            ["Privacy Policy", "/legal/privacy"],
            ["Terms of Use", "/legal/terms"],
          ]}
          extra={<CookiePreferencesLink />}
        />
      </div>

      <div className="max-w-content mx-auto flex flex-col md:flex-row justify-between items-center gap-2 pt-6 font-mono text-[11px] text-dim">
        <span>© {new Date().getFullYear()} Hivig · Naganarai Media Tech Private Limited</span>
        <span className="font-serif italic text-[14px] text-dim">Hi-tech intelligence. Human vigilance.</span>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  extra,
}: {
  title: string;
  links: [string, string][];
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-5 pb-3 border-b border-rule">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-[13px] text-muted hover:text-ink transition-colors">
              {label}
            </Link>
          </li>
        ))}
        {extra && <li>{extra}</li>}
      </ul>
    </div>
  );
}
