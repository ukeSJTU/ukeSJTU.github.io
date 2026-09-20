import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkCjkFriendlyParseOnly from "remark-cjk-friendly/parseOnly";
import remarkCjkFriendlyGfmParseOnly from "remark-cjk-friendly-gfm-strikethrough/parseOnly";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { Pluggable } from "unified";
import { z } from "zod";
import { compileMarkdownWithTableOfContents } from "./src/lib/content/markdown/compile-markdown-with-table-of-contents";
import { mermaidOptions } from "./src/lib/content/markdown/mermaid-options";
import { prettyCodeOptions } from "./src/lib/content/markdown/pretty-code";
import { rehypeCodeBlocks } from "./src/lib/content/markdown/rehype-code-blocks";
import { rehypeMermaidTheme } from "./src/lib/content/markdown/rehype-mermaid-theme";
import { rehypeTaskListLabels } from "./src/lib/content/markdown/rehype-task-list-labels";
import { remarkCodeMeta } from "./src/lib/content/markdown/remark-code-meta";

function createMarkdownOptions(afterSlug: Pluggable[] = []) {
  return {
    allowDangerousHtml: true,
    remarkPlugins: [
      [remarkGfm, { singleTilde: false }],
      remarkCjkFriendlyParseOnly,
      remarkCjkFriendlyGfmParseOnly,
      remarkMath,
      remarkCodeMeta,
    ] as Pluggable[],
    rehypePlugins: [
      rehypeSlug,
      ...afterSlug,
      rehypeKatex,
      [rehypeMermaid, mermaidOptions],
      rehypeMermaidTheme,
      [rehypePrettyCode, prettyCodeOptions],
      rehypeCodeBlocks,
      rehypeTaskListLabels,
    ] as Pluggable[],
  };
}

const markdownOptions = createMarkdownOptions();

const blog = defineCollection({
  name: "blog",
  directory: "content/blog",
  include: "**/*.md",
  schema: z.object({
    slug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers, and single hyphens only",
      ),
    title: z.string(),
    summary: z.string(),
    publishedAt: z.iso.date(),
    updatedAt: z.iso.date().optional(),
    content: z.string(),
  }),
  transform: async (post, context) => {
    const compiled = await compileMarkdownWithTableOfContents(
      context,
      post,
      createMarkdownOptions([rehypeExtractToc]),
    );

    return {
      ...post,
      ...compiled,
    };
  },
});

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "**/*.md",
  schema: z.object({
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
        ? await compileMarkdown(context, project, markdownOptions)
        : undefined,
    };
  },
});

export default defineConfig({
  content: [blog, projects],
});
