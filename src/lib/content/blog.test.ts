import assert from "node:assert/strict";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

type GeneratedPost = typeof import("content-collections")["allBlogs"][number];

function post(
  slug: string,
  publishedAt: string,
  updatedAt?: string,
): GeneratedPost {
  return {
    slug,
    title: slug,
    summary: "Fixture note",
    publishedAt,
    updatedAt,
    topics: ["markdown"],
    content: "A note",
    html: "<p>A note</p>",
    tableOfContents: [],
    _meta: {
      path: `nested/${slug}`,
      filePath: `nested/${slug}.md`,
      fileName: `${slug}.md`,
      directory: "nested",
      extension: "md",
    },
  };
}

beforeEach(() => {
  vi.resetModules();
  // Replace only the external generated dataset, not our content/query modules.
  // These fixtures make the tests independent of local articles and build output.
  vi.doMock("content-collections", () => ({
    allBlogs: [
      post("older", "2026-01-01"),
      post("newer", "2026-02-01"),
      post("revised", "2025-01-01", "2026-03-01"),
    ],
  }));
});

afterEach(() => {
  vi.doUnmock("content-collections");
  vi.resetModules();
});

test("recently revised notes precede newer publications, with publication dates as fallback", async () => {
  const { sortedBlogPosts } = await import("./blog");

  expect(sortedBlogPosts.map(({ slug }) => slug)).toEqual([
    "revised",
    "newer",
    "older",
  ]);
});

test.each([
  ["revised", "2026-03-01", "2026-03-01T00:00:00.000Z"],
  ["older", "2026-01-01", "2026-01-01T00:00:00.000Z"],
])("%s exposes its effective modification date as a date string and a UTC Date", async (slug, dateString, timestamp) => {
  const { getPostBySlug, getPostModifiedDate, getPostModifiedDateString } =
    await import("./blog");
  const found = getPostBySlug(slug);

  assert(found);
  expect(getPostModifiedDateString(found)).toBe(dateString);
  expect(getPostModifiedDate(found).toISOString()).toBe(timestamp);
});

test("a note is found by its public slug rather than its source directory", async () => {
  const { getPostBySlug, getPostPath } = await import("./blog");
  const found = getPostBySlug("revised");

  assert(found);
  expect(found).toMatchObject({ slug: "revised", title: "revised" });
  expect(getPostPath(found)).toBe("/blog/revised");
  expect(getPostBySlug("nested/revised")).toBeUndefined();
  expect(found).not.toHaveProperty("_meta");
  expect(found).not.toHaveProperty("content");
});
