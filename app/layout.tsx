import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Cormorant_Garamond, Libre_Baskerville, DM_Mono, Barlow } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dmmono",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
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
    <html lang="en" className={`${cormorant.variable} ${baskerville.variable} ${dmMono.variable} ${barlow.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <SiteChrome settings={settings} previewEnabled={previewEnabled}>{children}</SiteChrome>
      </body>
    </html>
  );
}
