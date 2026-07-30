import Link from "next/link";

function buildHref(params: { category?: string; platform?: string; page: number }) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.platform) qs.set("platform", params.platform);
  if (params.page > 1) qs.set("page", String(params.page));
  const s = qs.toString();
  return s ? `/intel?${s}` : "/intel";
}

export default function Pagination({
  page,
  totalPages,
  category,
  platform,
}: {
  page: number;
  totalPages: number;
  category?: string;
  platform?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 mt-16 font-mono text-[12px] tracking-[0.08em]"
    >
      {page > 1 ? (
        <Link
          href={buildHref({ category, platform, page: page - 1 })}
          className="px-4 py-2 border border-rule-strong text-ink hover:border-ink transition-colors"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-4 py-2 border border-rule text-dim cursor-not-allowed">← Prev</span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref({ category, platform, page: p })}
          aria-current={p === page ? "page" : undefined}
          className={`w-9 h-9 flex items-center justify-center border transition-colors ${
            p === page ? "bg-signal border-signal text-white" : "border-rule-strong text-muted hover:text-ink hover:border-ink"
          }`}
        >
          {p}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={buildHref({ category, platform, page: page + 1 })}
          className="px-4 py-2 border border-rule-strong text-ink hover:border-ink transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 border border-rule text-dim cursor-not-allowed">Next →</span>
      )}
    </nav>
  );
}
