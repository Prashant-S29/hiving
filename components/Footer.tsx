import CmsLink from "@/components/CmsLink";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";
import type { CmsLink as CmsLinkValue, SiteSettings } from "@/lib/sanity/siteSettings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear().toString();
  const copyright = settings.copyrightTemplate.replaceAll("{year}", year);

  return (
    <footer className="bg-void border-t-2 border-signal px-6 md:px-12 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-rule max-w-content mx-auto">
        <div>
          {settings.brand.logoUrl ? (
            <img
              src={settings.brand.logoUrl}
              alt={settings.brand.logoAlt || settings.siteName}
              className="h-10 w-auto mb-4"
            />
          ) : (
            <div className="font-serif text-3xl mb-4">
              <span className="italic text-ink">{settings.brand.primaryText}</span>
              <span className="font-bold text-signal">{settings.brand.accentText}</span>
            </div>
          )}
          <p className="text-[13px] text-muted leading-7 max-w-[280px] mb-5">
            {settings.footerDescription}
          </p>
          <div className="flex gap-2 flex-wrap">
            {settings.footerBadges.map((badge, index) => (
              <span
                key={badge}
                className={`font-mono text-[10px] tracking-[0.1em] px-2.5 py-1 border ${
                  index < 2 ? "border-signal text-signal" : "border-rule-strong text-muted"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {settings.footerColumns.map((column) => (
          <FooterCol
            key={column._key || column.title}
            title={column.title}
            links={column.links}
            extra={column.showCookiePreferences ? <CookiePreferencesLink label={settings.cookieConsent.preferencesLinkLabel} /> : undefined}
          />
        ))}
      </div>

      <div className="max-w-content mx-auto flex flex-col md:flex-row justify-between items-center gap-2 pt-6 font-mono text-[11px] text-dim">
        <span>{copyright}</span>
        <span className="font-serif italic text-[14px] text-dim">{settings.footerTagline}</span>
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
  links: CmsLinkValue[];
  extra?: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-5 pb-3 border-b border-rule">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link._key || `${link.label}-${link.href}`}>
            <CmsLink link={link} className="text-[13px] text-muted hover:text-ink transition-colors">
              {link.label}
            </CmsLink>
          </li>
        ))}
        {extra && <li>{extra}</li>}
      </ul>
    </div>
  );
}
