import type { Metadata } from "next";
import { PostList } from "@/components/post-list";
import { sortedPosts } from "@/lib/content/posts";
import { siteConfig } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "Posts",
  description: `Articles and technical notes by ${siteConfig.name}.`,
  alternates: {
    canonical: "/posts",
  },
};

export default function PostsPage() {
  return (
    <main className="page-content" id="main-content">
      <header className="max-w-2xl">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Writing
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Posts</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {sortedPosts.length} {sortedPosts.length === 1 ? "post" : "posts"},
          ordered by most recently updated.
        </p>
      </header>

      <section aria-labelledby="all-posts" className="mt-6">
        <h2 className="sr-only" id="all-posts">
          All posts
        </h2>
        <PostList posts={sortedPosts} />
      </section>
    </main>
  );
}
