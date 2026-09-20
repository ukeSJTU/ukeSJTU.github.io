import { allProjects } from "content-collections";
import { absoluteUrl } from "@/lib/site/config";

export type Project = (typeof allProjects)[number];

export function getProjectPath(path: string) {
  return `/projects/${path}`;
}

export function getProjectUrl(path: string) {
  return absoluteUrl(getProjectPath(path));
}

export const sortedProjects = [...allProjects].sort(
  (left, right) => left.order - right.order,
);

export const projectsWithArticles = sortedProjects.filter(
  (project) => project.hasArticle,
);
