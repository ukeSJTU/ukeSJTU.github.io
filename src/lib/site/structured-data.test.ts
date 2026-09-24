import { expect, test } from "vitest";
import { blogPostingReference, blogPostingSchema } from "./structured-data";

test("article listings and detail markup identify the same entity and preserve article facts", () => {
  const article = {
    title: "A note",
    summary: "A summary",
    publishedAt: "2026-01-01",
    modifiedAt: "2026-02-01",
  };
  const reference = blogPostingReference(article.title, "/blog/a-note");
  const detail = blogPostingSchema(article, "/blog/a-note");

  expect(reference).toEqual({
    "@type": "BlogPosting",
    "@id": "https://ukeraser.is-a.dev/blog/a-note#article",
    url: "https://ukeraser.is-a.dev/blog/a-note",
    headline: "A note",
  });
  expect(detail).toMatchObject({
    "@context": "https://schema.org",
    "@id": "https://ukeraser.is-a.dev/blog/a-note#article",
    mainEntityOfPage: "https://ukeraser.is-a.dev/blog/a-note",
    headline: "A note",
    description: "A summary",
    datePublished: "2026-01-01",
    dateModified: "2026-02-01",
    isPartOf: { "@id": "https://ukeraser.is-a.dev/#website" },
    author: { "@type": "Person", name: "ukeraser" },
  });
});
