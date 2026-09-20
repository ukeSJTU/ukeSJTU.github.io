import { expect, test } from "vitest";
import { toSearchResult } from "./search-result";

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
    href: "/blog/note#details",
    title: "Note",
    section: "Details",
    excerpt: "A <mark>match</mark>",
    date: "Jan 2, 2026",
  });
});
