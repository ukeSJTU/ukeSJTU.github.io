import assert from "node:assert/strict";
import { expect, test, vi } from "vitest";

vi.mock("content-collections", () => ({
  allProjects: [
    {
      slug: "stable-project",
      name: "Project",
      description: "A project",
      year: 2026,
      order: 2,
      hasArticle: true,
      html: "<p>Article</p>",
      content: "Article",
      _meta: { path: "nested/renamed" },
    },
    {
      slug: "link-only",
      name: "Link",
      description: "No article",
      year: 2026,
      order: 1,
      hasArticle: false,
      content: "",
      _meta: { path: "link" },
    },
  ],
}));

test("project lookup and article routes use stable slugs without exposing source metadata", async () => {
  const {
    getProjectBySlug,
    getProjectPath,
    sortedProjects,
    projectsWithArticles,
  } = await import("./projects");
  const project = getProjectBySlug("stable-project");

  assert(project);
  expect(getProjectPath(project)).toBe("/projects/stable-project");
  expect(project).not.toHaveProperty("_meta");
  expect(project).not.toHaveProperty("content");
  expect(getProjectBySlug("nested/renamed")).toBeUndefined();
  expect(projectsWithArticles.map(({ slug }) => slug)).toEqual([
    "stable-project",
  ]);
  expect(sortedProjects.map(({ slug }) => slug)).toEqual([
    "link-only",
    "stable-project",
  ]);
});
