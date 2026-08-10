import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { LegalPageContent, LegalTableBlock } from "@/lib/sanity/legalPages";

const legalComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = /^https?:\/\//.test(href);
      return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}</a>;
    },
  },
  types: {
    legalTable: ({ value }) => {
      const table = value as LegalTableBlock;
      return (
        <div className="overflow-x-auto my-8">
          <table>
            <thead>
              <tr>
                {table.headers.map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row._key}>
                  {row.cells.map((cell, index) => <td key={`${row._key}-${index}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export default function LegalPage({ page }: { page: LegalPageContent }) {
  const informationTone = page.notice.tone === "information";
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-[700px] mx-auto">
      <h1 className="font-serif text-[36px] font-bold tracking-tight mb-3">{page.title}</h1>
      <p className="font-mono text-[12px] text-muted mb-8">
        {page.lastUpdatedLabel} <strong className="text-ink">{page.lastUpdatedValue}</strong>
      </p>

      {page.notice.enabled && (
        <div className={`mt-6 mb-10 border p-4 font-body text-[15px] leading-[1.8] text-ink/85 ${
          informationTone ? "border-verify/40 bg-verify/10" : "border-amber/40 bg-amber/10"
        }`}>
          <span className={`font-mono text-[10px] uppercase tracking-[0.15em] block mb-2 ${informationTone ? "text-verify" : "text-amber"}`}>
            {page.notice.label}
          </span>
          {page.notice.body}
        </div>
      )}

      <div className="prose-hivig">
        <PortableText value={page.body} components={legalComponents} />
      </div>
    </section>
  );
}
