"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CmsLink from "./CmsLink";
import ThemeToggle from "./ThemeToggle";
import type { CmsAccent, SiteSettings } from "@/lib/sanity/siteSettings";

// "Orbit" nav — the same light, sticky-blur header design used on the
// homepage, now shared by every page via SiteChrome. Real CMS data
// (settings.navigation / headerCta / brand) drives the content, same
// contract as before this reskin — only the visual language changed.
// Deliberately always light (not theme-reactive): the nav is a fixed brand
// element, matching how it looks on the homepage regardless of page theme.
//
// Below the `lg` breakpoint the link list / badge / theme toggle / CTA
// collapse behind a hamburger into a dropdown panel — the full desktop row
// doesn't fit next to the logo on phone/tablet widths.

const ACCENT_COLORS: Record<CmsAccent, string> = {
  default: "#564334",
  signal: "#904d00",
  verify: "#1e9e56",
  amber: "#c97d10",
};

export default function Nav({ settings }: { settings: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
            className="hidden sm:inline-block"
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

        {/* Desktop row — full nav, badge, theme toggle, CTA inline. */}
        <div className="hidden lg:flex" style={{ alignItems: "center", gap: 22 }}>
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

        {/* Mobile/tablet — hamburger toggle only. */}
        <button
          type="button"
          className="flex lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="hv-mobile-nav-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ddc1ae",
            borderRadius: 8,
            background: "transparent",
            flexShrink: 0,
          }}
        >
          <span style={{ position: "relative", width: 18, height: 13 }}>
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background: "#241912",
                top: menuOpen ? 5.5 : 0,
                transform: menuOpen ? "rotate(45deg)" : "none",
                transition: "all 0.15s ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background: "#241912",
                top: 5.5,
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.15s ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background: "#241912",
                top: menuOpen ? 5.5 : 11,
                transform: menuOpen ? "rotate(-45deg)" : "none",
                transition: "all 0.15s ease",
              }}
            />
          </span>
        </button>
      </div>

      {/* Mobile/tablet dropdown panel — everything the desktop row holds,
          stacked, once the hamburger is opened. */}
      {menuOpen ? (
        <div
          id="hv-mobile-nav-panel"
          className="lg:hidden"
          style={{ borderTop: "1px solid #ddc1ae", background: "#fff8f5", padding: "8px 24px 20px" }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
            {settings.navigation.map((item) => (
              <li key={item._key || `${item.label}-${item.href}`} style={{ borderBottom: "1px solid #ecdccb" }}>
                <CmsLink
                  link={item}
                  style={{
                    display: "block",
                    padding: "14px 2px",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 14,
                    color: ACCENT_COLORS[item.accent || "default"],
                    fontWeight: item.accent && item.accent !== "default" ? 700 : 500,
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </CmsLink>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, gap: 12 }}>
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
            ) : (
              <span />
            )}

            <span style={{ "--color-rule-base": "0,0,0", "--rule-strong-alpha": "0.14", "--color-muted": "100,98,104", "--color-ink": "20,20,24" } as React.CSSProperties}>
              <ThemeToggle switchToLightLabel={settings.interfaceLabels.switchToLightLabel} switchToDarkLabel={settings.interfaceLabels.switchToDarkLabel} />
            </span>
          </div>

          <CmsLink
            link={settings.headerCta}
            style={{
              marginTop: 16,
              background: "#ff8c00",
              color: "#241912",
              fontWeight: 700,
              fontSize: 14,
              padding: "13px 16px",
              borderRadius: 8,
              border: "1px solid #904d00",
              textDecoration: "none",
              display: "block",
              textAlign: "center",
            }}
          >
            {settings.headerCta.label}
          </CmsLink>
        </div>
      ) : null}
    </nav>
  );
}
