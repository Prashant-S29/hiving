import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getPrivacyPage } from "@/lib/sanity/legalPages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacyPage();
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.openGraphTitle || seo.metaTitle,
      description: seo.openGraphDescription || seo.metaDescription,
      images: seo.openGraphImageUrl ? [{ url: seo.openGraphImageUrl }] : undefined,
    },
  };
}

export default async function PrivacyPage() {
  return <LegalPage page={await getPrivacyPage()} />;
}
