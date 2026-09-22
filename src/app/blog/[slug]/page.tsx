import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ReadingLayout } from "@/components/markdown/reading-layout";
import { PageTransition } from "@/components/page-transition";
import {
  formatPostDate,
  getPostBySlug,
  getPostModifiedDate,
  getPostModifiedDateString,
  getPostPath,
  getPostUpdatedDateString,
  parsePostDate,
  sortedBlogPosts,
} from "@/lib/content/blog";
import { getPostSeriesNavigation, getSeriesPath } from "@/lib/content/series";
import { getTagBySlug, getTagPath } from "@/lib/content/tags";
import { createPageMetadata } from "@/lib/site/metadata";
import { blogPostingSchema } from "@/lib/site/structured-data";
import { BlogComments } from "./_components/blog-comments";
import { BlogSeriesNavigation } from "./_components/blog-series-navigation";

export function generateStaticParams() {
  return sortedBlogPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Note not found",
      robots: { index: false, follow: false },
    };
  }

  const postPath = getPostPath(post);
  const publishedTime = parsePostDate(post.publishedAt).toISOString();
  const modifiedTime = getPostModifiedDate(post).toISOString();

  return createPageMetadata({
    title: post.title,
    description: post.summary,
    path: postPath,
    article: { publishedTime, modifiedTime },
  });
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const postPath = getPostPath(post);
  const seriesNavigation = getPostSeriesNavigation(post);
  const jsonLd = blogPostingSchema(
    { ...post, modifiedAt: getPostModifiedDateString(post) },
    postPath,
  );
  const updatedAt = getPostUpdatedDateString(post);

  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <JsonLd data={jsonLd} />
        <article data-pagefind-body data-pagefind-meta={`url:${postPath}`}>
          <ReadingLayout
            html={post.html}
            tableOfContents={post.tableOfContents}
            header={
              <>
                <div className="text-muted-foreground flex flex-wrap items-baseline gap-x-5 gap-y-2 text-xs">
                  <time dateTime={post.publishedAt}>
                    Published {formatPostDate(post.publishedAt)}
                  </time>
                  {updatedAt && (
                    <time dateTime={updatedAt}>
                      Updated {formatPostDate(updatedAt)}
                    </time>
                  )}
                  <a
                    className="text-primary ml-auto underline underline-offset-4"
                    href="#comments"
                    data-pagefind-ignore
                  >
                    Comments
                  </a>
                </div>
                <h1 data-pagefind-meta="title">{post.title}</h1>
                <p data-pagefind-meta="summary">{post.summary}</p>
                <div
                  className="text-muted-foreground mt-6 space-y-2 text-sm"
                  data-pagefind-ignore
                >
                  {seriesNavigation && (
                    <p>
                      Series:{" "}
                      <Link
                        className="text-primary underline underline-offset-4"
                        href={getSeriesPath(seriesNavigation.series)}
                      >
                        {seriesNavigation.series.name}
                      </Link>
                    </p>
                  )}
                  <p className="flex flex-wrap gap-x-3 gap-y-1">
                    Tags:{" "}
                    {post.tags.map((slug) => {
                      const tag = getTagBySlug(slug);
                      return tag ? (
                        <Link
                          className="text-primary underline underline-offset-4"
                          href={getTagPath(tag)}
                          key={slug}
                        >
                          {tag.name}
                        </Link>
                      ) : null;
                    })}
                  </p>
                </div>
              </>
            }
          >
            {seriesNavigation && (
              <BlogSeriesNavigation navigation={seriesNavigation} />
            )}
            <BlogComments />
          </ReadingLayout>
        </article>
      </main>
    </PageTransition>
  );
}
