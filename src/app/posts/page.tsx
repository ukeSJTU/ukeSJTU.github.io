import type { Metadata } from "next";
import Link from "next/link";
import {
  getPostModifiedAt,
  getPostPath,
  sortedPosts,
} from "@/lib/content/posts";
import { siteConfig } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "Posts",
  description: `${siteConfig.name} 的文章与技术写作归档。`,
  alternates: {
    canonical: "/posts",
  },
};

const dateFormatter = new Intl.DateTimeFormat(siteConfig.language, {
  dateStyle: "medium",
  timeZone: "Asia/Shanghai",
});

export default function PostsPage() {
  return (
    <main
      className="mx-auto min-h-screen w-full max-w-3xl px-6 pt-6 pb-16 sm:px-10 sm:pt-8"
      id="main-content"
    >
      <header className="max-w-2xl">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Writing
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Posts</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          完整的文章归档与筛选仍在整理中，当前内容暂时按最近更新时间排列。
        </p>
      </header>

      <section aria-label="文章列表" className="mt-10 divide-y divide-border">
        {sortedPosts.map((post) => (
          <article className="py-6 first:pt-0" key={post._meta.path}>
            <Link
              className="group block rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
              href={getPostPath(post._meta.path)}
            >
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h2 className="text-2xl font-semibold underline-offset-4 group-hover:underline">
                  {post.title}
                </h2>
                <time
                  className="text-muted-foreground shrink-0 font-mono text-sm"
                  dateTime={post.updatedAt ?? post.publishedAt}
                >
                  {dateFormatter.format(getPostModifiedAt(post))}
                </time>
              </div>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {post.summary}
              </p>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
