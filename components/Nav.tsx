import Link from "next/link";
import CmsLink from "./CmsLink";
import ThemeToggle from "./ThemeToggle";
import type { CmsAccent, SiteSettings } from "@/lib/sanity/siteSettings";

const ACCENT_CLASSES: Record<CmsAccent, string> = {
  default: "",
  signal: "text-signal",
  verify: "text-verify",
  amber: "text-amber",
};

export default function Nav({ settings }: { settings: SiteSettings }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-6 md:px-12 border-b border-rule bg-void/90 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5" aria-label={settings.interfaceLabels.homepageAriaLabel}>
        {settings.brand.logoUrl ? (
          <img src={settings.brand.logoUrl} alt={settings.brand.logoAlt || settings.siteName} className="h-8 w-auto" />
        ) : (
          <span className="font-serif text-2xl">
            <span className="italic text-ink">{settings.brand.primaryText}</span>
            <span className="font-bold text-signal">{settings.brand.accentText}</span>
          </span>
        )}
        <span className="w-1.5 h-1.5 rounded-full bg-signal animate-blink" />
      </Link>

      <ul className="hidden lg:flex gap-7 font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
        {settings.navigation.map((item) => (
          <li key={item._key || `${item.label}-${item.href}`} className={ACCENT_CLASSES[item.accent || "default"]}>
            <CmsLink link={item} className="hover:text-ink transition-colors">
              {item.label}
            </CmsLink>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {settings.headerBadge && (
          <span className="hidden xl:inline font-mono text-[10px] text-muted border border-rule-strong px-2.5 py-1">
            {settings.headerBadge}
          </span>
        )}
        <ThemeToggle
          switchToLightLabel={settings.interfaceLabels.switchToLightLabel}
          switchToDarkLabel={settings.interfaceLabels.switchToDarkLabel}
        />
        <CmsLink
          link={settings.headerCta}
          className="bg-signal hover:bg-signal-dark text-white font-sans text-[11px] font-bold uppercase tracking-[0.1em] px-5 py-2 transition-colors"
        >
          {settings.headerCta.label}
        </CmsLink>
      </div>
    </nav>
  );
}
