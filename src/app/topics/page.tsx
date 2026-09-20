import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { sortedBlogPosts } from "@/lib/content/blog";
import {
  getTopicUrl,
  topicGroups,
  topicsWithPosts,
} from "@/lib/content/topics";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { schemaEntity, siteAuthor } from "@/lib/site/structured-data";
import { TopicIndex } from "./_components/topic-index";

export const metadata: Metadata = createPageMetadata({
  title: "Topics",
  description: `Browse ${siteConfig.name}'s notes by topic.`,
  path: "/topics",
});

export default function TopicsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("CollectionPage", "/topics"),
    name: "Topics",
    description: metadata.description,
    inLanguage: siteConfig.language,
    author: siteAuthor,
    hasPart: topicsWithPosts.map((topic) => ({
      "@type": "DefinedTerm",
      name: topic.name,
      url: getTopicUrl(topic),
    })),
  };

  return (
    <PageTransition>
      <main
        className="page-content"
        data-pagefind-body
        data-pagefind-meta="url:/topics"
        id="main-content"
      >
        <JsonLd data={jsonLd} />
        <header className="max-w-2xl pb-8 sm:pb-10">
          <h1
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            data-pagefind-meta="title"
          >
            Topics
          </h1>
          <p
            className="text-muted-foreground mt-4 text-lg leading-relaxed"
            data-pagefind-meta="summary"
          >
            {topicsWithPosts.length}{" "}
            {topicsWithPosts.length === 1 ? "topic" : "topics"} across{" "}
            {sortedBlogPosts.length}{" "}
            {sortedBlogPosts.length === 1 ? "note" : "notes"}, grouped by
            subject.
          </p>
        </header>

        <TopicIndex groups={topicGroups} />
      </main>
    </PageTransition>
  );
}
