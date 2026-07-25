import Link from "next/link";
import type { Article } from "@/lib/types";
import { TAG_LABELS, TAG_COLORS } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ArticleTag({ article }: { article: Article }) {
  return (
    <div className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase border px-3 py-1 mb-4 ${TAG_COLORS[article.tagType]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {TAG_LABELS[article.tagType]}
    </div>
  );
}

export function FeaturedArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/intel/${article.slug.current}`}
      className="block bg-void hover:bg-deep transition-colors p-10 md:p-12 relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-signal scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      <ArticleTag article={article} />
      <h2 className="font-serif text-[28px] md:text-[40px] font-bold leading-[1.1] tracking-tight mb-4">
        {article.title}
      </h2>
      <p className="font-body text-[15px] leading-[1.8] text-ink/60 mb-7 max-w-[560px]">
        {article.deck}
      </p>
      <div className="flex items-center gap-5 font-mono text-[10px] tracking-[0.1em] uppercase text-muted">
        <span>{article.readTimeMinutes} min read</span>
        <span className="text-dim">·</span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/intel/${article.slug.current}`}
      className="block bg-void hover:bg-deep transition-colors p-9 relative overflow-hidden group"
    >
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-signal scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />
      <ArticleTag article={article} />
      <h3 className="font-serif text-[20px] font-bold leading-[1.25] tracking-tight mb-3">
        {article.title}
      </h3>
      <p className="font-body text-[13px] leading-[1.7] text-ink/55 mb-4 line-clamp-3">
        {article.deck}
      </p>
      <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.1em] uppercase text-muted">
        <span>{article.readTimeMinutes} min</span>
        <span className="text-dim">·</span>
        <span>{formatDate(article.publishedAt)}</span>
      </div>
    </Link>
  );
}
