import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAboutPage } from "@/lib/sanity/companyPages";

const aboutComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="font-serif text-[26px] font-bold text-ink pt-4">{children}</h2>,
    h3: ({ children }) => <h3 className="font-serif text-[21px] font-bold text-ink pt-3">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-signal pl-5 italic">{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = /^https?:\/\//.test(href);
      return <a href={href} className="text-signal hover:underline" target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}</a>;
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutPage();
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

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-[760px] mx-auto">
      <RevealOnScroll>
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-5">{page.eyebrow}</div>
        <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1.05] mb-10">
          {page.heading} <span className="italic text-signal">{page.headingEmphasis}</span>
        </h1>

        <div className="font-body text-[16px] leading-[1.9] text-ink/75 space-y-6">
          <PortableText value={page.body} components={aboutComponents} />
        </div>
      </RevealOnScroll>
    </section>
  );
}
