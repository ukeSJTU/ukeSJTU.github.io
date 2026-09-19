import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";

const notationTransformerOptions = {
  matchAlgorithm: "v3",
} as const;

export const prettyCodeOptions = {
  theme: {
    light: "github-light-default",
    dark: "github-dark-default",
  },
  keepBackground: false,
  grid: true,
  defaultLang: {
    block: "plaintext",
  },
  transformers: [
    transformerNotationDiff(notationTransformerOptions),
    transformerNotationHighlight(notationTransformerOptions),
    transformerNotationFocus(notationTransformerOptions),
    transformerNotationWordHighlight(notationTransformerOptions),
    transformerNotationErrorLevel(notationTransformerOptions),
  ],
} satisfies RehypePrettyCodeOptions;
