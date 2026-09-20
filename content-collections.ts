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

const topics = defineCollection({
  name: "topics",
  directory: "content/topics",
  include: "**/*.yaml",
  parser: "yaml",
  schema: z.object({
    slug: slugSchema,
    name: z.string().trim().min(1),
  }),
  onSuccess: (entries) => assertUniqueSlugs("topic", entries),
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
    topics: z
      .array(slugSchema)
      .min(1)
      .max(3)
      .refine((values) => new Set(values).size === values.length, {
        error: "Topics must not contain duplicates",
      }),
    content: z.string(),
  }),
  transform: async (post, context) => {
    const knownTopicSlugs = new Set(
      context.documents(topics).map((topic) => topic.slug),
    );
    const unknownTopicSlugs = post.topics.filter(
      (topic) => !knownTopicSlugs.has(topic),
    );

    if (unknownTopicSlugs.length > 0) {
      throw new Error(
        `Unknown topics in "${post._meta.path}": ${unknownTopicSlugs.join(", ")}`,
      );
    }

    const compiled = await compileMarkdown(context, post);

    return {
      ...post,
      ...compiled,
    };
  },
  onSuccess: (entries) => assertUniqueSlugs("blog", entries),
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

    return {
      ...project,
      hasArticle,
      html: hasArticle
        ? (await compileMarkdown(context, project)).html
        : undefined,
    };
  },
  onSuccess: (entries) => assertUniqueSlugs("project", entries),
});

export default defineConfig({
  content: [topics, blog, projects],
});
