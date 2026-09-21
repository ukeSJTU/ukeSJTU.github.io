import assert from "node:assert/strict";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

type GeneratedPost = typeof import("content-collections")["allBlogs"][number];

function meta(slug: string, extension: string) {
  return {
    path: `nested/${slug}`,
    filePath: `nested/${slug}.${extension}`,
    fileName: `${slug}.${extension}`,
    directory: "nested",
    extension,
  };
}

function post(
  slug: string,
  publishedAt: string,
  series?: GeneratedPost["series"],
): GeneratedPost {
  return {
    slug,
    title: slug,
    summary: "Fixture note",
    publishedAt,
    topics: ["test-topic"],
    series,
    content: "A note",
    html: "<p>A note</p>",
    tableOfContents: [],
    _meta: meta(slug, "md"),
  };
}

beforeEach(() => {
  vi.resetModules();
  // Only replace generated content; exercise the real queries and ordering.
  vi.doMock("content-collections", () => ({
    allSeries: [
      {
        slug: "empty",
        name: "Zulu",
        description: "Not started yet",
        _meta: meta("empty", "yaml"),
      },
      {
        slug: "sequence",
        name: "Alpha",
        description: "A reading path",
        _meta: meta("sequence", "yaml"),
      },
      {
        slug: "single",
        name: "Beta",
        description: "One note",
        _meta: meta("single", "yaml"),
      },
    ],
    allBlogs: [
      post("last", "2026-03-01", { slug: "sequence", order: 90 }),
      post("first", "2026-01-01", { slug: "sequence", order: 10 }),
      post("middle", "2026-02-01", { slug: "sequence", order: 30 }),
      post("standalone", "2026-04-01"),
      post("only", "2026-05-01", { slug: "single", order: 10 }),
    ],
  }));
});

afterEach(() => {
  vi.doUnmock("content-collections");
  vi.resetModules();
});

test("series sort by name and include empty definitions without exposing source metadata", async () => {
  const { seriesWithPosts, getSeriesBySlug, getSeriesPath, getSeriesUrl } =
    await import("./series");
  expect(seriesWithPosts.map(({ slug }) => slug)).toEqual([
    "sequence",
    "single",
    "empty",
  ]);
  const empty = getSeriesBySlug("empty");
  assert(empty);
  expect(empty.posts).toEqual([]);
  expect(empty).not.toHaveProperty("_meta");
  expect(getSeriesPath(empty)).toBe("/series/empty");
  expect(new URL(getSeriesUrl(empty)).pathname).toBe("/series/empty");
  expect(getSeriesBySlug("nested/empty")).toBeUndefined();
});

test("series use explicit order without changing global blog recency or article identity", async () => {
  const { getSeriesBySlug } = await import("./series");
  const { sortedBlogPosts, getPostPath } = await import("./blog");
  const sequence = getSeriesBySlug("sequence");
  assert(sequence);
  expect(sequence.posts.map(({ slug }) => slug)).toEqual([
    "first",
    "middle",
    "last",
  ]);
  expect(sequence.posts.map(getPostPath)).toEqual([
    "/blog/first",
    "/blog/middle",
    "/blog/last",
  ]);
  expect(sortedBlogPosts.map(({ slug }) => slug)).toEqual([
    "only",
    "standalone",
    "last",
    "middle",
    "first",
  ]);
  expect(sequence.posts[0]).not.toHaveProperty("content");
});

test.each([
  ["first", undefined, "middle"],
  ["middle", "first", "last"],
  ["last", "middle", undefined],
  ["only", undefined, undefined],
])("%s has only its actual neighbours, with no wrapping or crossing series", async (slug, previous, next) => {
  const { getPostSeriesNavigation } = await import("./series");
  const navigation = getPostSeriesNavigation({ slug });
  assert(navigation);
  expect(navigation.series.slug).toBe(slug === "only" ? "single" : "sequence");
  expect(navigation.previous?.slug).toBe(previous);
  expect(navigation.next?.slug).toBe(next);
});

test("standalone and unknown articles have no series navigation", async () => {
  const { getPostSeriesNavigation } = await import("./series");
  expect(getPostSeriesNavigation({ slug: "standalone" })).toBeUndefined();
  expect(getPostSeriesNavigation({ slug: "missing" })).toBeUndefined();
});
