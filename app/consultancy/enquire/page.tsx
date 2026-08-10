import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { getConsultancyPage } from "@/lib/sanity/conversionPages";

export async function generateMetadata(): Promise<Metadata> {
  const { enquirySeo: seo } = await getConsultancyPage();
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

export default async function ConsultancyEnquirePage() {
  const page = await getConsultancyPage();

  return (
    <section className="pt-32 pb-24 grid md:grid-cols-2 min-h-[80vh]">
      <div className="bg-paper text-void px-6 md:px-14 py-16 flex flex-col justify-center">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-signal mb-6 flex items-center gap-3">
          <span className="w-6 h-px bg-signal" /> {page.enquiryEyebrow}
        </div>
        <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1] mb-6">
          {page.enquiryHeadingLineOne}<br />{page.enquiryHeadingLineTwo} <span className="italic text-signal">{page.enquiryHeadingEmphasis}</span>
        </h1>
        <p className="font-body text-[15px] leading-[1.85] text-void/75 max-w-[420px]">{page.enquiryIntroduction}</p>
      </div>

      <div className="bg-void px-6 md:px-14 py-16 flex flex-col justify-center">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-5 block">
          {page.enquiryFormCaption}
        </span>
        <EnquiryForm copy={page.formCopy} />
      </div>
    </section>
  );
}
