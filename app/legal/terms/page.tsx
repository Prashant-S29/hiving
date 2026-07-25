import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-[700px] mx-auto">
      <h1 className="font-serif text-[36px] font-bold tracking-tight mb-8">Terms of Use</h1>
      <div className="font-body text-[15px] leading-[1.85] text-ink/70 space-y-5">
        <p>
          This page is a placeholder. Replace this content with terms of
          use reviewed by qualified counsel before the site goes live in
          production.
        </p>
        <p>
          Hivig™ is a registered trademark (Class 42, India) of Naganarai
          Media Tech Private Limited.
        </p>
        <p>Last updated: pending legal review.</p>
      </div>
    </section>
  );
}
