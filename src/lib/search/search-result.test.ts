import { expect, test } from "vitest";
import { toSearchResult } from "./search-result";

test.each([
  ["/index.html", "/"],
  ["/blog/note.html", "/blog/note"],
])("search results normalize %s when canonical metadata is absent", (url, href) => {
  expect(
    toSearchResult("hit", {
      url,
      excerpt: "A note",
      plain_excerpt: "A note",
      meta: {},
    }),
  ).toMatchObject({ href, title: "Untitled" });
});

test.each([
  ["/blog/note", "Article"],
  ["/series/path", "Series"],
  ["/projects/tool", "Project"],
  ["/tags/linux", "Tag"],
  ["/resume", "Page"],
  ["/projects", "Page"],
])("search results identify %s as %s", (url, type) => {
  expect(
    toSearchResult("hit", { url, excerpt: "", plain_excerpt: "", meta: {} })
      .type,
  ).toBe(type);
});

test("search results use the canonical page path and the matching section anchor", () => {
  expect(
    toSearchResult("hit", {
      url: "/exported/page.html",
      excerpt: "Page excerpt",
      plain_excerpt: "Page excerpt",
      meta: { title: "Note", url: "/blog/note", date: "2026-01-02" },
      sub_results: [
        {
          title: "Details",
          url: "/exported/page.html#details",
          excerpt: "A <mark>match</mark>",
          plain_excerpt: "A match",
        },
      ],
    }),
  ).toEqual({
    id: "hit",
    type: "Article",
    href: "/blog/note#details",
    title: "Note",
    section: "Details",
    excerpt: "A <mark>match</mark>",
    date: "Jan 2, 2026",
  });
});
