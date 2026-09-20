import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogComments } from "@/components/blog-comments";
import { BlogTableOfContents } from "@/components/blog-table-of-contents";
import { JsonLd } from "@/components/json-ld";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { PageTransition } from "@/components/page-transition";
import {
  getPostBySlug,
  getPostModifiedAt,
  getPostModifiedDate,
  getPostPath,
  parsePostDate,
  sortedBlogPosts,
} from "@/lib/content/blog";
import { siteConfig } from "@/lib/site/config";
import { createPageMetadata } from "@/lib/site/metadata";
import { blogPostingSchema } from "@/lib/site/structured-data";
import styles from "./page.module.css";

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
  const modifiedTime = getPostModifiedAt(post).toISOString();

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
  const jsonLd = blogPostingSchema(
    { ...post, modifiedAt: getPostModifiedDate(post) },
    postPath,
  );
  const formattedPublishedAt = new Intl.DateTimeFormat(siteConfig.language, {
    dateStyle: "long",
    timeZone: "Asia/Shanghai",
  }).format(parsePostDate(post.publishedAt));

  return (
    <PageTransition>
      <main className="page-content" id="main-content">
        <JsonLd data={jsonLd} />
        <Link
          className="text-muted-foreground inline-flex items-center gap-2 text-sm underline underline-offset-4"
          href="/blog"
          transitionTypes={["nav-back"]}
        >
          <IconArrowLeft aria-hidden="true" className="size-4" /> Back to blog
        </Link>

        <article
          className="mt-6"
          data-pagefind-body
          data-pagefind-meta={`url:${postPath}`}
        >
          <header className="border-border border-b pb-6">
            <h1
              className="text-4xl font-semibold sm:text-5xl"
              data-pagefind-meta="title"
            >
              {post.title}
            </h1>
            <p
              className="text-muted-foreground mt-4 text-lg"
              data-pagefind-meta="summary"
            >
              {post.summary}
            </p>
            <time
              className="text-muted-foreground mt-3 block text-sm"
              data-pagefind-meta="date[datetime]"
              dateTime={post.publishedAt}
            >
              Published on {formattedPublishedAt}
            </time>
          </header>

          <div className={styles.contentLayout}>
            <MarkdownRenderer
              className={styles.articleBody}
              contentKey={post.slug}
              html={post.html}
            />
            <BlogTableOfContents
              className={styles.tableOfContents}
              items={post.tableOfContents}
            />
          </div>
        </article>

        <BlogComments />
      </main>
    </PageTransition>
  );
}
