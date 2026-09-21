import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/blog-list";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { getPostUrl } from "@/lib/content/blog";
import {
  getSeriesBySlug,
  getSeriesPath,
  getSeriesUrl,
  seriesWithPosts,
} from "@/lib/content/series";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { blogPostingReference, schemaEntity } from "@/lib/site/structured-data";

export function generateStaticParams() {
  return seriesWithPosts.map((series) => ({ slug: series.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/series/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) {
    return {
      title: "Series not found",
      robots: { index: false, follow: false },
    };
  }
  return createPageMetadata({
    title: series.name,
    description: series.description,
    path: getSeriesPath(series),
  });
}

export default async function SeriesPage({
  params,
}: PageProps<"/series/[slug]">) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("CollectionPage", getSeriesUrl(series)),
    name: series.name,
    description: series.description,
    inLanguage: siteConfig.language,
    hasPart: series.posts.map((post) =>
      blogPostingReference(post.title, getPostUrl(post)),
    ),
  };

  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <JsonLd data={jsonLd} />
        <Link
          className="text-muted-foreground inline-flex items-center gap-2 text-sm underline underline-offset-4"
          href="/series"
          transitionTypes={["nav-back"]}
        >
          <IconArrowLeft aria-hidden="true" className="size-4" /> Back to series
        </Link>
        <header
          className="mt-6 max-w-2xl pb-8 sm:pb-10"
          data-pagefind-body
          data-pagefind-meta={`url:${getSeriesPath(series)}`}
        >
          <h1
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            data-pagefind-meta="title"
          >
            {series.name}
          </h1>
          <p
            className="text-muted-foreground mt-4 text-lg leading-relaxed"
            data-pagefind-meta="summary"
          >
            {series.description}
          </p>
          <p
            className="text-muted-foreground mt-3 text-sm"
            data-pagefind-ignore
          >
            {series.posts.length} {series.posts.length === 1 ? "note" : "notes"}
          </p>
        </header>
        <section aria-labelledby="series-notes">
          <h2 className="sr-only" id="series-notes">
            Notes in reading order
          </h2>
          {series.posts.length > 0 ? (
            <BlogList entries={series.posts} ordered />
          ) : (
            <p className="text-muted-foreground">No notes yet.</p>
          )}
        </section>
      </main>
    </PageTransition>
  );
}
