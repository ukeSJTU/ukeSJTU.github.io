import type { MetadataRoute } from "next";
import {
  getPostModifiedDate,
  getPostUrl,
  sortedPosts,
} from "@/lib/content/posts";
import { absoluteUrl, siteConfig } from "@/lib/site/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = sortedPosts.at(0);

  return [
    {
      url: siteConfig.url,
      lastModified: latestPost ? getPostModifiedDate(latestPost) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/posts"),
      lastModified: latestPost ? getPostModifiedDate(latestPost) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...sortedPosts.map((post) => ({
      url: getPostUrl(post._meta.path),
      lastModified: getPostModifiedDate(post),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
