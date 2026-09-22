import type { Metadata } from "next";
import { BlogList } from "@/components/blog-list";
import { PageHeading } from "@/components/page-heading";
import { PageTransition } from "@/components/page-transition";
import { sortedBlogPosts } from "@/lib/content/blog";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: `Notes on technology, learning, and making things by ${siteConfig.name}.`,
  path: "/blog",
});
export default function BlogPage() {
  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <PageHeading title="Blog" />
        <BlogList entries={sortedBlogPosts} />
      </main>
    </PageTransition>
  );
}
