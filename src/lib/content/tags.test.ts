import { expect, test, vi } from "vitest";

vi.mock("content-collections", () => ({
  allTags: [
    { slug: "zulu", name: "Zulu", _meta: {} },
    { slug: "alpha", name: "Alpha", _meta: {} },
    { slug: "another", name: "Another", _meta: {} },
  ],
  allBlogs: [
    {
      slug: "old",
      publishedAt: "2026-01-01",
      updatedAt: "2026-03-01",
      tags: ["alpha"],
    },
    { slug: "new", publishedAt: "2026-02-01", tags: ["alpha", "zulu"] },
  ],
}));
test("tags group alphabetically, retain empty labels, and use maintained article order", async () => {
  const { tagGroups, getTagBySlug, getTagPath } = await import("./tags");
  expect(
    tagGroups.map(({ initial, tags }) => [
      initial,
      tags.map((tag) => tag.slug),
    ]),
  ).toEqual([
    ["A", ["alpha", "another"]],
    ["Z", ["zulu"]],
  ]);
  expect(getTagBySlug("alpha")?.posts.map((post) => post.slug)).toEqual([
    "old",
    "new",
  ]);
  expect(getTagBySlug("another")?.posts).toEqual([]);
  expect(getTagBySlug("missing")).toBeUndefined();
  expect(getTagPath({ slug: "alpha" })).toBe("/tags/alpha");
});
