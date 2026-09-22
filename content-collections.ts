import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMarkdown } from "./src/lib/content/markdown/compile-markdown";

const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers, and single hyphens only",
  );

function assertUniqueSlugs(
  kind: string,
  entries: { slug: string; _meta: { path: string } }[],
) {
  const pathsBySlug = new Map<string, string>();

  for (const entry of entries) {
    const existingPath = pathsBySlug.get(entry.slug);
    if (existingPath !== undefined) {
      throw new Error(
        `Duplicate ${kind} slug "${entry.slug}" in "${existingPath}" and "${entry._meta.path}"`,
      );
    }
    pathsBySlug.set(entry.slug, entry._meta.path);
  }
}

const tags = defineCollection({
  name: "tags",
  directory: "content/tags",
  include: "**/*.yaml",
  parser: "yaml",
  schema: z.object({
    slug: slugSchema,
    name: z.string().trim().min(1),
  }),
  onSuccess: (entries) => assertUniqueSlugs("tag", entries),
});

const series = defineCollection({
  name: "series",
  directory: "content/series",
  include: "**/*.yaml",
  parser: "yaml",
  schema: z.object({
    slug: slugSchema,
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
  }),
  onSuccess: (entries) => assertUniqueSlugs("series", entries),
});

const blog = defineCollection({
  name: "blog",
  directory: "content/blog",
  include: "**/*.md",
  schema: z.object({
    slug: slugSchema,
    title: z.string(),
    summary: z.string(),
    publishedAt: z.iso.date(),
    updatedAt: z.iso.date().optional(),
    tags: z
      .array(slugSchema)
      .min(1)
      .max(3)
      .refine((values) => new Set(values).size === values.length, {
        error: "Tags must not contain duplicates",
      }),
    series: z
      .object({
        slug: slugSchema,
        order: z.number().int().positive(),
      })
      .optional(),
    content: z.string(),
  }),
  transform: async (post, context) => {
    const knownTagSlugs = new Set(
      context.documents(tags).map((tag) => tag.slug),
    );
    const unknownTagSlugs = post.tags.filter((tag) => !knownTagSlugs.has(tag));

    if (unknownTagSlugs.length > 0) {
      throw new Error(
        `Unknown tags in "${post._meta.path}": ${unknownTagSlugs.join(", ")}`,
      );
    }

    if (
      post.series &&
      !context
        .documents(series)
        .some((entry) => entry.slug === post.series?.slug)
    ) {
      throw new Error(
        `Unknown series in "${post._meta.path}": ${post.series.slug}`,
      );
    }

    const compiled = await compileMarkdown(context, post);

    return {
      ...post,
      ...compiled,
    };
  },
  onSuccess: (entries) => {
    assertUniqueSlugs("blog", entries);
    const pathsByPosition = new Map<string, string>();

    for (const post of entries) {
      if (!post.series) continue;
      const { slug, order } = post.series;
      const key = `${slug}:${order}`;
      const existingPath = pathsByPosition.get(key);
      if (existingPath !== undefined) {
        throw new Error(
          `Duplicate order ${order} in series "${slug}" in "${existingPath}" and "${post._meta.path}"`,
        );
      }
      pathsByPosition.set(key, post._meta.path);
    }
  },
});

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.md",
  schema: z.object({
    slug: slugSchema,
    name: z.string(),
    description: z.string(),
    year: z.number().int(),
    order: z.number().int(),
    demo: z.url().optional(),
    source: z.url().optional(),
    content: z.string(),
  }),
  transform: async (project, context) => {
    const hasArticle = project.content.trim().length > 0;
    const compiled = hasArticle
      ? await compileMarkdown(context, project)
      : undefined;

    return {
      ...project,
      hasArticle,
      html: compiled?.html,
      tableOfContents: compiled?.tableOfContents ?? [],
    };
  },
  onSuccess: (entries) => assertUniqueSlugs("project", entries),
});

export default defineConfig({
  content: [tags, series, blog, projects],
});
