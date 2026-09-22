// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import type { Project } from "@/lib/content/projects";
import { ProjectList } from "./project-list";

vi.mock("content-collections", () => ({ allProjects: [] }));
test("only projects with bodies link their titles, with separate external actions and full descriptions", () => {
  const entries: Project[] = [true, false].map((hasArticle, order) => ({
    slug: `project-${order}`,
    name: `Project ${order}`,
    description: "Complete project description",
    hasArticle,
    html: hasArticle ? "<p>Details</p>" : undefined,
    tableOfContents: [],
    order,
    year: 2026,
    source: "https://example.com/source",
  }));
  const document = new DOMParser().parseFromString(
    renderToStaticMarkup(createElement(ProjectList, { entries })),
    "text/html",
  );
  expect(
    [...document.querySelectorAll("h2 a")].map((link) =>
      link.getAttribute("href"),
    ),
  ).toEqual(["/projects/project-0"]);
  expect(
    document.querySelectorAll('a[href="https://example.com/source"]'),
  ).toHaveLength(2);
  expect(document.querySelector("a a")).toBeNull();
  expect(document.body.textContent).not.toContain("Read article");
  expect(
    [...document.querySelectorAll("li > p")].map(
      (paragraph) => paragraph.textContent,
    ),
  ).toEqual(entries.map((entry) => entry.description));
});
