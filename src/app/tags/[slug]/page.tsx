import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/blog-list";
import { EmptyArticles } from "@/components/empty-articles";
import { JsonLd } from "@/components/json-ld";
import { PageHeading } from "@/components/page-heading";
import { PageTransition } from "@/components/page-transition";
import { getPostUrl } from "@/lib/content/blog";
import {
  getTagBySlug,
  getTagPath,
  getTagUrl,
  tagsWithPosts,
} from "@/lib/content/tags";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { blogPostingReference, schemaEntity } from "@/lib/site/structured-data";

export function generateStaticParams() {
  return tagsWithPosts.map((tag) => ({ slug: tag.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/tags/[slug]">): Promise<Metadata> {
  const tag = getTagBySlug((await params).slug);
  if (!tag)
    return { title: "Tag not found", robots: { index: false, follow: false } };
  return createPageMetadata({
    title: tag.name,
    description: `Articles tagged ${tag.name}.`,
    path: getTagPath(tag),
  });
}

export default async function TagPage({ params }: PageProps<"/tags/[slug]">) {
  const tag = getTagBySlug((await params).slug);
  if (!tag) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("CollectionPage", getTagUrl(tag)),
    name: tag.name,
    inLanguage: siteConfig.language,
    about: { "@type": "DefinedTerm", name: tag.name },
    hasPart: tag.posts.map((post) =>
      blogPostingReference(post.title, getPostUrl(post)),
    ),
  };
  return (
    <PageTransition>
      <main
        className="page-content"
        data-pagefind-body
        data-pagefind-meta={`url:${getTagPath(tag)}`}
        id="main-content"
      >
        <JsonLd data={jsonLd} />
        <PageHeading
          title={tag.name}
          detail={`${tag.posts.length} ${tag.posts.length === 1 ? "article" : "articles"}`}
        />
        {tag.posts.length ? (
          <BlogList entries={tag.posts} />
        ) : (
          <EmptyArticles />
        )}
      </main>
    </PageTransition>
  );
}
