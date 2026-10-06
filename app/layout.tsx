import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

// The site uses exactly two typefaces: Geist for headings (loaded via <link>
// below) and Inter for subheads/body, exposed as --font-inter and surfaced to
// the rest of the app as --font-body (see app/globals.css).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const seo = settings.defaultSeo;

  return {
    metadataBase: new URL("https://hivig.com"),
    title: {
      default: seo.metaTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: seo.metaDescription,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.openGraphTitle || seo.metaTitle,
      description: seo.openGraphDescription || seo.metaDescription,
      url: "https://hivig.com",
      siteName: settings.siteName,
      type: "website",
      images: seo.openGraphImageUrl ? [{ url: seo.openGraphImageUrl }] : undefined,
    },
  };
}

// Runs before paint so the light/dark choice from a prior visit applies
// immediately — without this, the page would flash dark before switching to
// a saved light preference (FOUC). Defaults to dark (the brand default) if
// no preference has been saved yet.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('hivig-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const previewEnabled = draftMode().isEnabled;

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Geist isn't in this Next.js version's next/font/google list yet — loaded
            as a regular stylesheet instead. It's the site's heading font
            (--font-heading in app/globals.css). */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <SiteChrome settings={settings} previewEnabled={previewEnabled}>{children}</SiteChrome>
      </body>
    </html>
  );
}
