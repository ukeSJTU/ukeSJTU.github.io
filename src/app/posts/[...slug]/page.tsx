import { allPosts } from "content-collections";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import {
  getPostModifiedAt,
  getPostOgImage,
  getPostPath,
  getPostUrl,
  parsePostDate,
} from "@/lib/content/posts";
import { absoluteUrl, siteConfig, socialImageConfig } from "@/lib/site/config";

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
      title: "文章未找到",
      robots: { index: false, follow: false },
    };
  }

  const postPath = getPostPath(post._meta.path);
  const ogImage = getPostOgImage(post);
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
      images: [
        {
          url: ogImage.url,
          width: socialImageConfig.width,
          height: socialImageConfig.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [
        {
          url: ogImage.url,
          width: socialImageConfig.width,
          height: socialImageConfig.height,
          alt: ogImage.alt,
        },
      ],
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

  const postUrl = getPostUrl(post._meta.path);
  const ogImage = getPostOgImage(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    url: postUrl,
    mainEntityOfPage: postUrl,
    headline: post.title,
    description: post.summary,
    image: ogImage.url,
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
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-16 sm:px-10">
      <JsonLd data={jsonLd} />
      <Link
        className="text-muted-foreground text-sm underline underline-offset-4"
        href="/"
      >
        ← All posts
      </Link>

      <article className="mt-10">
        <header className="border-border border-b pb-8">
          <h1 className="text-4xl font-semibold sm:text-5xl">{post.title}</h1>
          <p className="text-muted-foreground mt-4 text-lg">{post.summary}</p>
          <time
            className="text-muted-foreground mt-3 block text-sm"
            dateTime={post.publishedAt}
          >
            发布于 {formattedPublishedAt}
          </time>
        </header>

        <div className="bg-muted mt-8 aspect-[40/21] overflow-hidden rounded-2xl">
          <Image
            alt={ogImage.alt}
            className="size-full object-cover"
            height={630}
            loading="eager"
            sizes="(min-width: 768px) 704px, calc(100vw - 48px)"
            src={ogImage.path}
            width={1200}
          />
        </div>

        <MarkdownRenderer
          className="mt-10"
          contentKey={post._meta.path}
          html={post.html}
        />
      </article>
    </main>
  );
}
