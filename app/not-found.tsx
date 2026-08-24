import CmsLink from "@/components/CmsLink";
import { getNotFoundPage } from "@/lib/sanity/legalPages";

export default async function NotFound() {
  const page = await getNotFoundPage();
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-content mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="font-serif text-[100px] font-bold text-signal leading-none mb-4">{page.code}</div>
      <h1 className="font-serif text-[28px] font-bold mb-4">{page.heading}</h1>
      <p className="font-body text-ink/60 mb-8 max-w-[400px]">{page.body}</p>
      <div className="flex gap-4">
        <CmsLink link={page.primaryAction} className="rounded-lg bg-signal hover:bg-signal-dark text-[#241912] hover:text-white font-cta text-[14px] font-bold px-7 py-3.5 transition-colors">
          {page.primaryAction.label}
        </CmsLink>
        <CmsLink link={page.secondaryAction} className="rounded-lg border border-rule-strong text-ink font-cta text-[14px] font-bold px-7 py-3.5 transition-colors hover:border-signal">
          {page.secondaryAction.label}
        </CmsLink>
      </div>
    </section>
  );
}
