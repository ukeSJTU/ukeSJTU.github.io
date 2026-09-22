import type { MetadataRoute } from "next";
import {
  getPostModifiedDateString,
  getPostUrl,
  sortedBlogPosts,
} from "@/lib/content/blog";
import { getProjectUrl, projectsWithArticles } from "@/lib/content/projects";
import { getSeriesUrl, seriesWithPosts } from "@/lib/content/series";
import {
  getTagsModifiedDate,
  getTagUrl,
  tagsWithPosts,
} from "@/lib/content/tags";
import { absoluteUrl, siteConfig } from "@/lib/site/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = sortedBlogPosts.at(0);

  return [
    {
      url: siteConfig.url,
      lastModified: latestPost
        ? getPostModifiedDateString(latestPost)
        : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latestPost
        ? getPostModifiedDateString(latestPost)
        : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/resume"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/projects"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/tags"),
      lastModified: getTagsModifiedDate(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/series"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...seriesWithPosts.map((series) => ({
      url: getSeriesUrl(series),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tagsWithPosts.map((tag) => ({
      url: getTagUrl(tag),
      lastModified: tag.posts.at(0)
        ? getPostModifiedDateString(tag.posts[0])
        : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...sortedBlogPosts.map((post) => ({
      url: getPostUrl(post),
      lastModified: getPostModifiedDateString(post),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projectsWithArticles.map((project) => ({
      url: getProjectUrl(project),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
