import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Baskerville, DM_Mono, Barlow } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://hivig.com"),
  title: {
    default: "Hivig — Hi-Tech Vigilance for the Agentic Age",
    template: "%s | Hivig",
  },
  description:
    "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis — no vendor sponsorships, ever.",
  openGraph: {
    title: "Hivig — Hi-Tech Vigilance for the Agentic Age",
    description:
      "Independent intelligence on agentic AI. Platform verdicts, implementation guides, and fearless analysis.",
    url: "https://hivig.com",
    siteName: "Hivig",
    type: "website",
  },
};

// Runs before paint so the light/dark choice from a prior visit applies
// immediately — without this, the page would flash dark before switching to
// a saved light preference (FOUC). Defaults to dark (the brand default) if
// no preference has been saved yet.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('hivig-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${baskerville.variable} ${dmMono.variable} ${barlow.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased noise-overlay cursor-enabled">
        <CustomCursor />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
