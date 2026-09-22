import { getPostBySlug, getPostPath } from "./blog";
import { getProjectBySlug, getProjectPath } from "./projects";
import { getSeriesBySlug, getSeriesPath } from "./series";

type FeaturedReference = {
  type: "Article" | "Project" | "Series";
  slug: string;
};

// An explicit editorial order, independent of recency and collection order.
const selectedWork: FeaturedReference[] = [
  { type: "Project", slug: "coderadio-nvim" },
  { type: "Article", slug: "code-radio-api-schema" },
  { type: "Series", slug: "linux-through-commands" },
];

export function getFeaturedWork(
  references: readonly FeaturedReference[] = selectedWork,
) {
  return references.map(({ type, slug }) => {
    if (type === "Article") {
      const post = getPostBySlug(slug);
      if (post)
        return {
          type,
          href: getPostPath(post),
          title: post.title,
          description: post.summary,
        };
    } else if (type === "Project") {
      const project = getProjectBySlug(slug);
      if (project?.hasArticle)
        return {
          type,
          href: getProjectPath(project),
          title: project.name,
          description: project.description,
        };
    } else {
      const series = getSeriesBySlug(slug);
      if (series)
        return {
          type,
          href: getSeriesPath(series),
          title: series.name,
          description: series.description,
        };
    }
    throw new Error(`Invalid selected work reference: ${type} ${slug}`);
  });
}
