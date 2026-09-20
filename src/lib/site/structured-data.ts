import { absoluteUrl, siteConfig } from "./config";

const entityFragments = {
  WebSite: "website",
  BlogPosting: "article",
  SoftwareSourceCode: "project",
  CollectionPage: "collection",
} as const;

export const siteAuthor = {
  "@type": "Person",
  name: siteConfig.author.name,
  url: siteConfig.author.url,
} as const;

export function schemaEntity<T extends keyof typeof entityFragments>(
  type: T,
  path: string,
) {
  const url = absoluteUrl(path);
  return { "@type": type, "@id": `${url}#${entityFragments[type]}`, url };
}

export function blogPostingReference(title: string, path: string) {
  return { ...schemaEntity("BlogPosting", path), headline: title };
}

export function blogPostingSchema(
  post: {
    title: string;
    summary: string;
    publishedAt: string;
    modifiedAt: string;
  },
  path: string,
) {
  const reference = blogPostingReference(post.title, path);
  return {
    "@context": "https://schema.org",
    ...reference,
    mainEntityOfPage: reference.url,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    inLanguage: siteConfig.language,
    author: siteAuthor,
    publisher: siteAuthor,
    isPartOf: { "@id": schemaEntity("WebSite", "/")["@id"] },
  };
}
