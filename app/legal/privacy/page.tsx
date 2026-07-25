import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-[700px] mx-auto">
      <h1 className="font-serif text-[36px] font-bold tracking-tight mb-8">Privacy Policy</h1>
      <div className="font-body text-[15px] leading-[1.85] text-ink/70 space-y-5">
        <p>
          This page is a placeholder. Replace this content with a privacy
          policy reviewed by qualified counsel before the site goes live in
          production, covering what data is collected through the
          subscribe form and any analytics tools in use, how it is stored,
          and how a user can request deletion.
        </p>
        <p>Last updated: pending legal review.</p>
      </div>
    </section>
  );
}
