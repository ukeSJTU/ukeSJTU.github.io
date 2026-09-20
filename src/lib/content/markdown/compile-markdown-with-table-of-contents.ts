import type { Context, Meta } from "@content-collections/core";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { type Pluggable, unified } from "unified";
import { normalizeTableOfContents } from "./table-of-contents";

type MarkdownDocument = {
  _meta: Meta;
  content: string;
};

type MarkdownOptions = {
  allowDangerousHtml?: boolean;
  rehypePlugins?: Pluggable[];
  remarkPlugins?: Pluggable[];
};

async function compileMarkdown(
  document: MarkdownDocument,
  options: MarkdownOptions,
) {
  const processor = unified().use(remarkParse);

  if (options.remarkPlugins !== undefined) {
    processor.use(options.remarkPlugins);
  }

  processor.use(remarkRehype, {
    allowDangerousHtml: options.allowDangerousHtml,
  });

  if (options.allowDangerousHtml) {
    processor.use(rehypeRaw);
  }

  if (options.rehypePlugins !== undefined) {
    processor.use(options.rehypePlugins);
  }

  const file = await processor.use(rehypeStringify).process({
    data: { _meta: document._meta },
    value: document.content,
  });

  if (file.data.toc === undefined) {
    throw new Error("Markdown pipeline did not extract a table of contents");
  }

  return {
    html: String(file),
    tableOfContents: normalizeTableOfContents(file.data.toc),
  };
}

export function compileMarkdownWithTableOfContents(
  { cache }: Pick<Context, "cache">,
  document: MarkdownDocument,
  options: MarkdownOptions,
) {
  const cacheKey = {
    content: document.content,
    _meta: document._meta,
  };

  return cache(
    cacheKey,
    (cachedDocument) => compileMarkdown(cachedDocument, options),
    {
      key: "__markdown_with_table_of_contents",
    },
  );
}
