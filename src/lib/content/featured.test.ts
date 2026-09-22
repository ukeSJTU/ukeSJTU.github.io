import { expect, test, vi } from "vitest";
import { getFeaturedWork } from "./featured";

vi.mock("content-collections", () => ({
  allBlogs: [
    {
      slug: "note",
      title: "A note",
      summary: "Note summary",
      publishedAt: "2026-01-01",
      tags: [],
      _meta: {},
      content: "",
    },
  ],
  allProjects: [
    {
      slug: "tool",
      name: "A tool",
      description: "Tool description",
      hasArticle: true,
      order: 1,
    },
    { slug: "link-only", name: "Link only", hasArticle: false, order: 2 },
  ],
  allSeries: [
    { slug: "path", name: "A path", description: "Path description" },
  ],
}));

test("curated references preserve cross-type order and use existing descriptions", () => {
  expect(
    getFeaturedWork([
      { type: "Series", slug: "path" },
      { type: "Article", slug: "note" },
      { type: "Project", slug: "tool" },
    ]),
  ).toEqual([
    {
      type: "Series",
      href: "/series/path",
      title: "A path",
      description: "Path description",
    },
    {
      type: "Article",
      href: "/blog/note",
      title: "A note",
      description: "Note summary",
    },
    {
      type: "Project",
      href: "/projects/tool",
      title: "A tool",
      description: "Tool description",
    },
  ]);
});
test("bad curated references fail rather than publishing broken links or filler", () => {
  expect(() => getFeaturedWork([{ type: "Article", slug: "missing" }])).toThrow(
    "missing",
  );
  expect(() =>
    getFeaturedWork([{ type: "Project", slug: "link-only" }]),
  ).toThrow("link-only");
  expect(getFeaturedWork([])).toEqual([]);
});
