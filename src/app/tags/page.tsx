import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageHeading } from "@/components/page-heading";
import { PageTransition } from "@/components/page-transition";
import { getTagUrl, tagGroups, tagsWithPosts } from "@/lib/content/tags";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { schemaEntity, siteAuthor } from "@/lib/site/structured-data";
import { TagIndex } from "./_components/tag-index";

export const metadata: Metadata = createPageMetadata({
  title: "Tags",
  description: `Browse ${siteConfig.name}'s notes by tag.`,
  path: "/tags",
});

export default function TagsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("CollectionPage", "/tags"),
    name: "Tags",
    description: metadata.description,
    inLanguage: siteConfig.language,
    author: siteAuthor,
    hasPart: tagsWithPosts.map((tag) => ({
      "@type": "DefinedTerm",
      name: tag.name,
      url: getTagUrl(tag),
    })),
  };
  return (
    <PageTransition>
      <main
        className="page-content"
        data-pagefind-body
        data-pagefind-meta="url:/tags"
        id="main-content"
      >
        <JsonLd data={jsonLd} />
        <PageHeading title="Tags" />
        <TagIndex groups={tagGroups} />
      </main>
    </PageTransition>
  );
}
