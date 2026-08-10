import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { articleBySlugQuery } from "@/lib/sanity/queries";
import { cmsFallbacksEnabled, fetchCms } from "@/lib/sanity/fetch";
import { categoryLabels, getEditorialSettings } from "@/lib/sanity/editorialSettings";
import type { Article } from "@/lib/types";
import { TAG_COLORS } from "@/lib/types";
import { portableTextComponents } from "@/lib/portableTextComponents";
import { ArticleCard } from "@/components/ArticleCard";

async function getArticle(slug: string): Promise<Article | null> {
  const fallback = cmsFallbacksEnabled
    ? (await import("@/lib/mockArticles")).mockArticles.find((article) => article.slug.current === slug) || null
    : null;
  return fetchCms<Article | null>({
    query: articleBySlugQuery,
    params: { slug },
    fallback,
    label: `article ${slug}`,
    tags: ["sanity:articles", `sanity:article:${slug}`],
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.deck;
  return {
    title,
    description,
    alternates: article.canonicalUrl ? { canonical: article.canonicalUrl } : undefined,
    robots: article.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: article.openGraphTitle || title,
      description: article.openGraphDescription || description,
      images: article.openGraphImageUrl ? [{ url: article.openGraphImageUrl }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, settings] = await Promise.all([getArticle(params.slug), getEditorialSettings()]);
  if (!article) notFound();

  const labels = categoryLabels(settings);
  const dateOptions: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", dateOptions);
  const reviewedDate = article.reviewedAt ? new Date(article.reviewedAt).toLocaleDateString("en-US", dateOptions) : null;
  const articleCardCopy = {
    categoryLabels: labels,
    minuteShortLabel: settings.minuteShortLabel,
    minuteReadLabel: settings.minuteReadLabel,
  };

  return (
    <article className="pt-32 pb-24">
      <div className="px-6 md:px-12 max-w-[760px] mx-auto">
        <Link href="/intel" className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted hover:text-signal transition-colors">
          {settings.backToArchiveLabel}
        </Link>

        <div className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase border px-3 py-1 mt-8 mb-6 ${TAG_COLORS[article.tagType]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {labels[article.tagType]}
        </div>

        <h1 className="font-serif text-[34px] md:text-[52px] font-bold leading-[1.08] tracking-tight mb-6">
          {article.title}
        </h1>

        <p className="font-body text-[18px] leading-[1.8] text-ink/65 mb-8">
          {article.deck}
        </p>

        <div className="flex items-center gap-5 font-mono text-[11px] tracking-[0.08em] uppercase text-muted pb-10 border-b border-rule mb-12 flex-wrap">
          <span>{article.author}{article.authorDetails?.role ? ` · ${article.authorDetails.role}` : ""}</span>
          <span className="text-dim">·</span>
          <span>{date}</span>
          <span className="text-dim">·</span>
          <span>{article.readTimeMinutes} {settings.minuteReadLabel}</span>
          {reviewedDate && <><span className="text-dim">·</span><span>{settings.lastReviewedLabel}: {reviewedDate}</span></>}
        </div>

        <div className="prose-hivig">
          {article.body ? (
            <PortableText value={article.body} components={portableTextComponents} />
          ) : (
            <p>{settings.missingBodyMessage}</p>
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

        {article.sources && article.sources.length > 0 && (
          <section className="mt-12 pt-8 border-t border-rule">
            <h2 className="font-serif text-2xl font-bold text-ink">{settings.sourcesHeading}</h2>
            <ol className="mt-4 space-y-3 font-body text-sm text-ink/70">
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-signal hover:text-ink transition-colors">{source.name}</a>
                  {source.publicationDate ? ` · ${source.publicationDate}` : ""}
                  {source.summary ? <span className="block mt-1 text-ink/55">{source.summary}</span> : null}
                </li>
              ))}
            </ol>
          </section>
        )}

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-rule">
            <h2 className="font-serif text-2xl font-bold text-ink mb-5">{settings.relatedArticlesHeading}</h2>
            <div className="grid md:grid-cols-2 gap-px bg-rule">
              {article.relatedArticles.map((related) => <ArticleCard key={related._id} article={related} copy={articleCardCopy} />)}
            </div>
          </section>
        )}

        <div className="mt-10 text-center"><span className="font-serif text-signal text-2xl">▲</span></div>
      </div>
    </article>
  );
}
