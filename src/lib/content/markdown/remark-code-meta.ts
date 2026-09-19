import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type CodeMetaNode = {
  data?: Record<string, unknown> & {
    hProperties?: Record<string, unknown>;
  };
  meta?: string | null;
};

export const remarkCodeMeta: Plugin = () => (tree) => {
  visit(tree, "code", (node) => {
    const codeNode = node as unknown as CodeMetaNode;

    if (!codeNode.meta) {
      return;
    }

    codeNode.data ??= {};
    codeNode.data.hProperties ??= {};
    codeNode.data.hProperties.metastring = codeNode.meta;
  });
};
