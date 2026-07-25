import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-content mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="font-serif text-[100px] font-bold text-signal leading-none mb-4">404</div>
      <h1 className="font-serif text-[28px] font-bold mb-4">This page doesn&rsquo;t exist.</h1>
      <p className="font-body text-ink/60 mb-8 max-w-[400px]">
        It may have moved, or it might be a page Hivig hasn&rsquo;t published yet.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="bg-signal hover:bg-signal-dark text-white font-sans text-[12px] font-bold uppercase tracking-[0.1em] px-7 py-3.5 transition-colors">
          Go Home
        </Link>
        <Link href="/intel" className="border border-rule-strong text-ink font-sans text-[12px] font-bold uppercase tracking-[0.1em] px-7 py-3.5 transition-colors hover:border-signal">
          Read Intel
        </Link>
      </div>
    </section>
  );
}
