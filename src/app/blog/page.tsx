import type { Metadata } from "next";
import { BlogList } from "@/components/blog-list";
import { PageTransition } from "@/components/page-transition";
import { sortedBlogPosts } from "@/lib/content/blog";
import { siteConfig } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes on technology, learning, and making things by ${siteConfig.name}.`,
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <header className="max-w-2xl">
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Writing
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Blog</h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            {sortedBlogPosts.length}{" "}
            {sortedBlogPosts.length === 1 ? "note" : "notes"}, ordered by most
            recently updated.
          </p>
        </header>

        <section aria-labelledby="all-notes" className="mt-6">
          <h2 className="sr-only" id="all-notes">
            All notes
          </h2>
          <BlogList entries={sortedBlogPosts} />
        </section>
      </main>
    </PageTransition>
  );
}
