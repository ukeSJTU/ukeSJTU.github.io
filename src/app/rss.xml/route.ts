import { Feed } from "feed";
import {
  getPostModifiedAt,
  getPostUrl,
  parsePostDate,
  sortedBlogPosts,
} from "@/lib/content/blog";
import { absoluteUrl, siteConfig } from "@/lib/site/config";

export const dynamic = "force-static";

export function GET() {
  const latestPost = sortedBlogPosts.at(0);
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: siteConfig.language,
    favicon: absoluteUrl("/favicon.ico"),
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author.name}`,
    updated: latestPost ? getPostModifiedAt(latestPost) : undefined,
    generator: "Next.js + feed",
    feedLinks: {
      rss: absoluteUrl("/rss.xml"),
    },
    author: {
      name: siteConfig.author.name,
      link: siteConfig.author.url,
    },
  });

  for (const post of sortedBlogPosts) {
    const url = getPostUrl(post);

    feed.addItem({
      title: post.title,
      id: url,
      guid: url,
      link: url,
      description: post.summary,
      date: getPostModifiedAt(post),
      published: parsePostDate(post.publishedAt),
      author: [
        {
          name: siteConfig.author.name,
          link: siteConfig.author.url,
        },
      ],
    });
  }

  return new Response(`\uFEFF${feed.rss2()}`, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
