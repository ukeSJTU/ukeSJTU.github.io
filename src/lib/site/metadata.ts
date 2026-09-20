import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./config";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  article?: { publishedTime?: string; modifiedTime?: string };
};

export function createPageMetadata({
  title,
  description,
  path,
  article,
}: PageMetadata): Metadata {
  const url = absoluteUrl(path);

  // Next.js merges these nested fields shallowly, so supply a complete set.
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": absoluteUrl("/rss.xml") },
    },
    openGraph: {
      ...(article
        ? {
            type: "article" as const,
            authors: [siteConfig.author.name],
            ...article,
          }
        : { type: "website" as const }),
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url,
      title,
      description,
    },
    twitter: { card: "summary", title, description },
  };
}
