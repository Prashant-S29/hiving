import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Enquire — Hivig Consulting",
  description: "Tell us what you're building — Hivig Consulting responds within 48 hours.",
};

export default function ConsultancyEnquirePage() {
  return (
    <section className="pt-32 pb-24 grid md:grid-cols-2 min-h-[80vh]">
      <div className="bg-paper text-void px-6 md:px-14 py-16 flex flex-col justify-center">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-signal mb-6 flex items-center gap-3">
          <span className="w-6 h-px bg-signal" /> Hivig Consulting
        </div>
        <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1] mb-6">
          Tell us what<br />you&rsquo;re <span className="italic text-signal">building.</span>
        </h1>
        <p className="font-body text-[15px] leading-[1.85] text-void/75 max-w-[420px]">
          The same independent rigour behind every Hivig verdict, applied
          directly to your organisation. We typically respond within 48
          hours to discuss scope, timeline, and whether Hivig is the right
          fit for what you need.
        </p>
      </div>

      <div className="bg-void px-6 md:px-14 py-16 flex flex-col justify-center">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-5 block">
          Consultancy enquiry · hivig.com
        </span>
        <EnquiryForm />
      </div>
    </section>
  );
}
