import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import rehypePrettyCode from "rehype-pretty-code";
import remarkCjkFriendlyParseOnly from "remark-cjk-friendly/parseOnly";
import remarkCjkFriendlyGfmParseOnly from "remark-cjk-friendly-gfm-strikethrough/parseOnly";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { z } from "zod";
import { mermaidOptions } from "./src/lib/content/markdown/mermaid-options";
import { prettyCodeOptions } from "./src/lib/content/markdown/pretty-code";
import { rehypeCodeBlocks } from "./src/lib/content/markdown/rehype-code-blocks";
import { rehypeMermaidTheme } from "./src/lib/content/markdown/rehype-mermaid-theme";
import { rehypeTaskListLabels } from "./src/lib/content/markdown/rehype-task-list-labels";
import { remarkCodeMeta } from "./src/lib/content/markdown/remark-code-meta";

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.iso.date(),
    updatedAt: z.iso.date().optional(),
    ogImage: z
      .string()
      .regex(
        /^\/.*\.(?:png|jpe?g)$/i,
        "ogImage must be an absolute site path to a PNG or JPEG image",
      )
      .optional(),
    content: z.string(),
  }),
  transform: async (post, context) => ({
    ...post,
    html: await compileMarkdown(context, post, {
      allowDangerousHtml: true,
      remarkPlugins: [
        [remarkGfm, { singleTilde: false }],
        remarkCjkFriendlyParseOnly,
        remarkCjkFriendlyGfmParseOnly,
        remarkMath,
        remarkCodeMeta,
      ],
      rehypePlugins: [
        rehypeKatex,
        [rehypeMermaid, mermaidOptions],
        rehypeMermaidTheme,
        [rehypePrettyCode, prettyCodeOptions],
        rehypeCodeBlocks,
        rehypeTaskListLabels,
      ],
    }),
  }),
});

export default defineConfig({
  content: [posts],
});
