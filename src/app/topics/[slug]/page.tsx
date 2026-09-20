import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/blog-list";
import { JsonLd } from "@/components/json-ld";
import { PageTransition } from "@/components/page-transition";
import { getPostUrl } from "@/lib/content/blog";
import {
  getTopicBySlug,
  getTopicPath,
  getTopicUrl,
  topicsWithPosts,
} from "@/lib/content/topics";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { blogPostingReference, schemaEntity } from "@/lib/site/structured-data";

export function generateStaticParams() {
  return topicsWithPosts.map((topic) => ({ slug: topic.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/topics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {
      title: "Topic not found",
      robots: { index: false, follow: false },
    };
  }

  const description = `${topic.posts.length} ${topic.posts.length === 1 ? "note" : "notes"} filed under ${topic.name}.`;

  return createPageMetadata({
    title: topic.name,
    description,
    path: getTopicPath(topic),
  });
}

export default async function TopicPage({
  params,
}: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const topicPath = getTopicPath(topic);
  const topicUrl = getTopicUrl(topic);
  const jsonLd = {
    "@context": "https://schema.org",
    ...schemaEntity("CollectionPage", topicUrl),
    name: topic.name,
    description: `${topic.posts.length} ${topic.posts.length === 1 ? "note" : "notes"} filed under ${topic.name}.`,
    inLanguage: siteConfig.language,
    about: {
      "@type": "DefinedTerm",
      name: topic.name,
    },
    hasPart: topic.posts.map((post) =>
      blogPostingReference(post.title, getPostUrl(post)),
    ),
  };

  return (
    <PageTransition>
      <main
        className="page-content"
        data-pagefind-body
        data-pagefind-meta={`url:${topicPath}`}
        id="main-content"
      >
        <JsonLd data={jsonLd} />
        <Link
          className="text-muted-foreground inline-flex items-center gap-2 text-sm underline underline-offset-4"
          href="/topics"
          transitionTypes={["nav-back"]}
        >
          <IconArrowLeft aria-hidden="true" className="size-4" /> Back to topics
        </Link>

        <header className="mt-6 max-w-2xl pb-8 sm:pb-10">
          <h1
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
            data-pagefind-meta="title"
          >
            {topic.name}
          </h1>
          <p
            className="text-muted-foreground mt-4 text-lg leading-relaxed"
            data-pagefind-meta="summary"
          >
            {[
              topic.posts.length,
              topic.posts.length === 1 ? "note" : "notes",
              "filed under this topic.",
            ].join(" ")}
          </p>
        </header>

        <section aria-labelledby="topic-notes">
          <h2 className="sr-only" id="topic-notes">
            Notes about {topic.name}
          </h2>
          <BlogList entries={topic.posts} />
        </section>
      </main>
    </PageTransition>
  );
}
