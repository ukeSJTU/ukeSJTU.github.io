import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/blog-list";
import { EmptyArticles } from "@/components/empty-articles";
import { JsonLd } from "@/components/json-ld";
import { PageHeading } from "@/components/page-heading";
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
        <div
          data-pagefind-body
          data-pagefind-meta={`url:${getSeriesPath(series)}`}
        >
          <PageHeading
            title={series.name}
            description={series.description}
            detail={`${series.posts.length} ${series.posts.length === 1 ? "article" : "articles"}`}
          />
        </div>
        <section aria-labelledby="series-notes">
          <h2 className="sr-only" id="series-notes">
            Notes in reading order
          </h2>
          {series.posts.length > 0 ? (
            <BlogList entries={series.posts} ordered />
          ) : (
            <EmptyArticles />
          )}
        </section>
      </main>
    </PageTransition>
  );
}
