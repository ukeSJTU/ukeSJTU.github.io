// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import type { Post } from "@/lib/content/blog";
import { BlogList } from "./blog-list";

vi.mock("content-collections", () => ({ allBlogs: [] }));
const posts: Post[] = [10, 30].map((order, index) => ({
  slug: `note-${index}`,
  title: `Complete title ${index}`,
  summary: "A summary",
  publishedAt: "2026-01-01",
  updatedAt: index === 0 ? "2026-02-01" : undefined,
  tags: ["test"],
  series: { slug: "path", order },
  html: "",
  tableOfContents: [],
}));
function render(ordered = false) {
  return new DOMParser().parseFromString(
    renderToStaticMarkup(createElement(BlogList, { entries: posts, ordered })),
    "text/html",
  );
}
test("article rows each have one destination and correctly labelled dates", () => {
  const document = render();
  expect(
    [...document.querySelectorAll("li a")].map((link) =>
      link.getAttribute("href"),
    ),
  ).toEqual(["/blog/note-0", "/blog/note-1"]);
  expect(
    [...document.querySelectorAll("time")].map((time) => time.textContent),
  ).toEqual(["Updated Feb 1, 2026", "Published Jan 1, 2026"]);
});
test("series reading order uses a native ordered list without dates or raw authoring positions", () => {
  const document = render(true);
  expect(document.querySelectorAll("ol > li")).toHaveLength(2);
  expect(document.querySelector("time")).toBeNull();
  expect(
    [...document.querySelectorAll("h2")].map((title) => title.textContent),
  ).toEqual(["Complete title 0", "Complete title 1"]);
  expect(document.querySelector("li[value]")).toBeNull();
});
