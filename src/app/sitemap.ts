import type { MetadataRoute } from "next";
import {
  getPostModifiedDate,
  getPostUrl,
  sortedBlogPosts,
} from "@/lib/content/blog";
import { absoluteUrl, siteConfig } from "@/lib/site/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = sortedBlogPosts.at(0);

  return [
    {
      url: siteConfig.url,
      lastModified: latestPost ? getPostModifiedDate(latestPost) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latestPost ? getPostModifiedDate(latestPost) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...sortedBlogPosts.map((post) => ({
      url: getPostUrl(post._meta.path),
      lastModified: getPostModifiedDate(post),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
