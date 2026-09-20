import { expect, test } from "vitest";
import { createPageMetadata } from "./metadata";

test("page metadata gives canonical and social previews the same page identity", () => {
  const metadata = createPageMetadata({
    title: "About",
    description: "About this garden",
    path: "/about",
  });

  expect(metadata).toMatchObject({
    title: "About",
    description: "About this garden",
    alternates: { canonical: "https://ukesjtu.github.io/about" },
    openGraph: {
      type: "website",
      title: "About",
      description: "About this garden",
      url: "https://ukesjtu.github.io/about",
    },
    twitter: {
      card: "summary",
      title: "About",
      description: "About this garden",
    },
  });
});

test("article metadata retains publication dates and authors alongside shared defaults", () => {
  const metadata = createPageMetadata({
    title: "A note",
    description: "A summary",
    path: "/blog/a-note",
    article: {
      publishedTime: "2026-01-01T00:00:00.000Z",
      modifiedTime: "2026-02-01T00:00:00.000Z",
    },
  });

  expect(metadata.openGraph).toMatchObject({
    type: "article",
    url: "https://ukesjtu.github.io/blog/a-note",
    title: "A note",
    publishedTime: "2026-01-01T00:00:00.000Z",
    modifiedTime: "2026-02-01T00:00:00.000Z",
    authors: ["ukeraser"],
  });
  expect(metadata.alternates?.types).toEqual({
    "application/rss+xml": "https://ukesjtu.github.io/rss.xml",
  });
});
