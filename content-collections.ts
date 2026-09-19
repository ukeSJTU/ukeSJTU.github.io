import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import rehypeKatex from "rehype-katex";
import rehypeMermaid, { type RehypeMermaidOptions } from "rehype-mermaid";
import rehypePrettyCode from "rehype-pretty-code";
import remarkCjkFriendlyParseOnly from "remark-cjk-friendly/parseOnly";
import remarkCjkFriendlyGfmParseOnly from "remark-cjk-friendly-gfm-strikethrough/parseOnly";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { z } from "zod";
import { prettyCodeOptions } from "./src/lib/content/markdown/pretty-code";
import { rehypeCodeBlocks } from "./src/lib/content/markdown/rehype-code-blocks";
import {
  mermaidIdPrefix,
  rehypeMermaidTheme,
} from "./src/lib/content/markdown/rehype-mermaid-theme";
import { remarkCodeMeta } from "./src/lib/content/markdown/remark-code-meta";

const mermaidOptions = {
  strategy: "img-svg",
  colorScheme: "light",
  prefix: mermaidIdPrefix,
  mermaidConfig: {
    theme: "base",
    securityLevel: "strict",
    fontFamily: "Arial, sans-serif",
    themeVariables: {
      background: "#ffffff",
      primaryColor: "#f5f5f5",
      primaryTextColor: "#171717",
      primaryBorderColor: "#737373",
      secondaryColor: "#e5e5e5",
      secondaryTextColor: "#262626",
      secondaryBorderColor: "#a3a3a3",
      tertiaryColor: "#fafafa",
      tertiaryTextColor: "#171717",
      tertiaryBorderColor: "#d4d4d4",
      lineColor: "#525252",
      textColor: "#171717",
      noteBkgColor: "#f5f5f5",
      noteTextColor: "#171717",
      noteBorderColor: "#a3a3a3",
    },
  },
  dark: {
    theme: "base",
    securityLevel: "strict",
    fontFamily: "Arial, sans-serif",
    themeVariables: {
      background: "#171717",
      primaryColor: "#262626",
      primaryTextColor: "#fafafa",
      primaryBorderColor: "#a3a3a3",
      secondaryColor: "#404040",
      secondaryTextColor: "#fafafa",
      secondaryBorderColor: "#737373",
      tertiaryColor: "#262626",
      tertiaryTextColor: "#fafafa",
      tertiaryBorderColor: "#525252",
      lineColor: "#d4d4d4",
      textColor: "#fafafa",
      noteBkgColor: "#262626",
      noteTextColor: "#fafafa",
      noteBorderColor: "#737373",
    },
  },
} satisfies RehypeMermaidOptions;

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
      ],
    }),
  }),
});

export default defineConfig({
  content: [posts],
});
