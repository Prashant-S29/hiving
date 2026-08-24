import Link from "next/link";
import CmsLink from "./CmsLink";
import ThemeToggle from "./ThemeToggle";
import type { CmsAccent, SiteSettings } from "@/lib/sanity/siteSettings";

// "Orbit" nav — the same light, sticky-blur header design used on the
// homepage, now shared by every page via SiteChrome. Real CMS data
// (settings.navigation / headerCta / brand) drives the content, same
// contract as before this reskin — only the visual language changed.
// Deliberately always light (not theme-reactive): the nav is a fixed brand
// element, matching how it looks on the homepage regardless of page theme.

const ACCENT_COLORS: Record<CmsAccent, string> = {
  default: "#564334",
  signal: "#904d00",
  verify: "#1e9e56",
  amber: "#c97d10",
};

export default function Nav({ settings }: { settings: SiteSettings }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(255,248,245,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #ddc1ae",
        fontFamily: "'Geist', system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" aria-label={settings.interfaceLabels.homepageAriaLabel} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          {settings.brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.brand.logoUrl} alt={settings.brand.logoAlt || settings.siteName} style={{ height: 28, width: "auto", borderRadius: 6, display: "block" }} />
          ) : (
            <span style={{ fontFamily: "'Geist', system-ui, sans-serif", fontWeight: 800, fontSize: 20, color: "#241912" }}>
              {settings.brand.primaryText}
              <span style={{ color: "#904d00" }}>{settings.brand.accentText}</span>
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              color: "#904d00",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              paddingLeft: 6,
              borderLeft: "1px solid #ddc1ae",
              lineHeight: 1.25,
            }}
          >
            Hi-Tech
            <br />
            Vigilance
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <ul style={{ display: "flex", alignItems: "center", gap: 22, listStyle: "none", margin: 0, padding: 0 }}>
            {settings.navigation.map((item) => (
              <li key={item._key || `${item.label}-${item.href}`}>
                <CmsLink
                  link={item}
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 12,
                    color: ACCENT_COLORS[item.accent || "default"],
                    fontWeight: item.accent && item.accent !== "default" ? 700 : 400,
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </CmsLink>
              </li>
            ))}
          </ul>

          {settings.headerBadge ? (
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                color: "#897362",
                border: "1px solid #ddc1ae",
                padding: "4px 9px",
                borderRadius: 6,
              }}
            >
              {settings.headerBadge}
            </span>
          ) : null}

          {/* ThemeToggle's own classes read the page's theme-dependent rule/muted/ink
              tokens, tuned for whatever theme the page body is in — but this nav is
              always light, so those can go invisible against it in dark mode. Pin
              the light-theme values locally; Tailwind's utility classes still pick
              them up via the cascade. */}
          <span style={{ "--color-rule-base": "0,0,0", "--rule-strong-alpha": "0.14", "--color-muted": "100,98,104", "--color-ink": "20,20,24" } as React.CSSProperties}>
            <ThemeToggle switchToLightLabel={settings.interfaceLabels.switchToLightLabel} switchToDarkLabel={settings.interfaceLabels.switchToDarkLabel} />
          </span>

          <CmsLink
            link={settings.headerCta}
            style={{
              background: "#ff8c00",
              color: "#241912",
              fontWeight: 700,
              fontSize: 13,
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #904d00",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {settings.headerCta.label}
          </CmsLink>
        </div>
      </div>
    </nav>
  );
}
