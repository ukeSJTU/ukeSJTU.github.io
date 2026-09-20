import { IconArrowLeft } from "@tabler/icons-react";
import { allPosts } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import {
  getPostModifiedAt,
  getPostPath,
  getPostUrl,
  parsePostDate,
} from "@/lib/content/posts";
import { absoluteUrl, siteConfig } from "@/lib/site/config";

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._meta.path.split("/") }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  const post = allPosts.find((candidate) => candidate._meta.path === path);

  if (!post) {
    return {
      title: "Post not found",
      robots: { index: false, follow: false },
    };
  }

  const postPath = getPostPath(post._meta.path);
  const publishedTime = parsePostDate(post.publishedAt).toISOString();
  const modifiedTime = getPostModifiedAt(post).toISOString();

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: postPath,
      types: {
        "application/rss+xml": absoluteUrl("/rss.xml"),
      },
    },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: postPath,
      siteName: siteConfig.name,
      title: post.title,
      description: post.summary,
      publishedTime,
      modifiedTime,
      authors: [siteConfig.author.name],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/posts/[...slug]">) {
  const { slug } = await params;
  const path = slug.join("/");
  const post = allPosts.find((candidate) => candidate._meta.path === path);

  if (!post) {
    notFound();
  }

  const postPath = getPostPath(post._meta.path);
  const postUrl = getPostUrl(post._meta.path);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    url: postUrl,
    mainEntityOfPage: postUrl,
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: siteConfig.language,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
  };
  const formattedPublishedAt = new Intl.DateTimeFormat(siteConfig.language, {
    dateStyle: "long",
    timeZone: "Asia/Shanghai",
  }).format(parsePostDate(post.publishedAt));

  return (
    <main className="page-content" id="main-content">
      <JsonLd data={jsonLd} />
      <Link
        className="text-muted-foreground inline-flex items-center gap-2 text-sm underline underline-offset-4"
        href="/posts"
      >
        <IconArrowLeft aria-hidden="true" className="size-4" /> All posts
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

        <MarkdownRenderer
          className="mt-6"
          contentKey={post._meta.path}
          html={post.html}
        />
      </article>
    </main>
  );
}
