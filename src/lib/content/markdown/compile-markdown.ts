import type { Context, Meta } from "@content-collections/core";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkCjkFriendlyParseOnly from "remark-cjk-friendly/parseOnly";
import remarkCjkFriendlyGfmParseOnly from "remark-cjk-friendly-gfm-strikethrough/parseOnly";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { mermaidOptions } from "./mermaid-options";
import { prettyCodeOptions } from "./pretty-code";
import { rehypeCodeBlocks } from "./rehype-code-blocks";
import { rehypeMermaidTheme } from "./rehype-mermaid-theme";
import { rehypeTaskListLabels } from "./rehype-task-list-labels";
import { remarkCodeMeta } from "./remark-code-meta";
import { normalizeTableOfContents } from "./table-of-contents";

type MarkdownDocument = {
  _meta: Meta;
  content: string;
};

async function renderMarkdown(document: MarkdownDocument) {
  // This pipeline accepts trusted repository-owned Markdown, not user input.
  // Extract the TOC immediately after assigning heading IDs so both agree.
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkCjkFriendlyParseOnly)
    .use(remarkCjkFriendlyGfmParseOnly)
    .use(remarkMath)
    .use(remarkCodeMeta)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeExtractToc)
    .use(rehypeKatex)
    .use(rehypeMermaid, mermaidOptions)
    .use(rehypeMermaidTheme)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeCodeBlocks)
    .use(rehypeTaskListLabels)
    .use(rehypeStringify)
    .process({ data: { _meta: document._meta }, value: document.content });

  return {
    html: String(file),
    tableOfContents: normalizeTableOfContents(file.data.toc ?? []),
  };
}

export function compileMarkdown(
  { cache }: Pick<Context, "cache">,
  { content, _meta }: MarkdownDocument,
) {
  return cache({ content, _meta }, renderMarkdown, { key: "__site_markdown" });
}
