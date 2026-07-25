import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { client, sanityConfigured } from "@/lib/sanity/client";
import { articleBySlugQuery } from "@/lib/sanity/queries";
import { mockArticles } from "@/lib/mockArticles";
import type { Article } from "@/lib/types";
import { TAG_LABELS, TAG_COLORS } from "@/lib/types";
import { portableTextComponents } from "@/lib/portableTextComponents";

async function getArticle(slug: string): Promise<Article | null> {
  if (sanityConfigured && client) {
    try {
      const data = await client.fetch(articleBySlugQuery, { slug });
      if (data) return data;
    } catch {
      // fall through to mock
    }
  }
  return mockArticles.find((a) => a.slug.current === slug) || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.deck,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <article className="pt-32 pb-24">
      <div className="px-6 md:px-12 max-w-[760px] mx-auto">
        <Link href="/intel" className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted hover:text-signal transition-colors">
          ← All Intel
        </Link>

        <div className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase border px-3 py-1 mt-8 mb-6 ${TAG_COLORS[article.tagType]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {TAG_LABELS[article.tagType]}
        </div>

        <h1 className="font-serif text-[34px] md:text-[52px] font-bold leading-[1.08] tracking-tight mb-6">
          {article.title}
        </h1>

        <p className="font-body text-[18px] leading-[1.8] text-ink/65 mb-8">
          {article.deck}
        </p>

        <div className="flex items-center gap-5 font-mono text-[11px] tracking-[0.08em] uppercase text-muted pb-10 border-b border-rule mb-12 flex-wrap">
          <span>{article.author}</span>
          <span className="text-dim">·</span>
          <span>{date}</span>
          <span className="text-dim">·</span>
          <span>{article.readTimeMinutes} min read</span>
        </div>

        <div className="prose-hivig">
          {article.body ? (
            <PortableText value={article.body as any} components={portableTextComponents} />
          ) : (
            <p>Full article content goes here once published from Sanity Studio.</p>
          )}
        </div>

        {article.platformTags && article.platformTags.length > 0 && (
          <div className="mt-14 pt-8 border-t border-rule flex gap-2 flex-wrap">
            {article.platformTags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] tracking-[0.1em] uppercase border border-rule-strong text-muted px-3 py-1.5">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <span className="font-serif text-signal text-2xl">▲</span>
        </div>
      </div>
    </article>
  );
}
