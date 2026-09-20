import { allProjects } from "content-collections";
import { absoluteUrl } from "@/lib/site/config";

export type Project = Omit<(typeof allProjects)[number], "_meta" | "content">;

export function getProjectPath(project: Pick<Project, "slug">) {
  return `/projects/${project.slug}`;
}

export function getProjectUrl(project: Pick<Project, "slug">) {
  return absoluteUrl(getProjectPath(project));
}

export const sortedProjects: Project[] = allProjects
  .map(({ _meta, content, ...project }) => project)
  .sort((left, right) => left.order - right.order);

const projectsBySlug = new Map(
  sortedProjects.map((project) => [project.slug, project]),
);

export function getProjectBySlug(slug: string) {
  return projectsBySlug.get(slug);
}

export const projectsWithArticles = sortedProjects.filter(
  (project) => project.hasArticle,
);
