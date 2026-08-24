"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { VisualEditing } from "next-sanity";
import CookieConsent from "@/components/CookieConsent";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import type { SiteSettings } from "@/lib/sanity/siteSettings";

export default function SiteChrome({
  children,
  settings,
  previewEnabled,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
  previewEnabled: boolean;
}) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");
  // The "Orbit" homepage brings its own nav/hero/footer (different brand
  // direction, still under review) — same bypass pattern as /studio so it
  // doesn't get double nav/footer from the site-wide dark-editorial chrome.
  const isBareChrome = isStudio || pathname === "/";

  useEffect(() => {
    document.body.classList.toggle("cursor-enabled", !isBareChrome);
    return () => document.body.classList.remove("cursor-enabled");
  }, [isBareChrome]);

  if (isBareChrome) return <main>{children}</main>;

  return (
    <div className="noise-overlay">
      <CustomCursor />
      <Nav settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <CookieConsent copy={settings.cookieConsent} />
      {previewEnabled && <VisualEditing />}
    </div>
  );
}
