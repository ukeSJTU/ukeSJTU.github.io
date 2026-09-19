import { Feed } from "feed";
import {
  getPostModifiedAt,
  getPostUrl,
  parsePostDate,
  sortedPosts,
} from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const latestPost = sortedPosts.at(0);
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

  for (const post of sortedPosts) {
    const url = getPostUrl(post._meta.path);

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

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
