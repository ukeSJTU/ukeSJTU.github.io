import type { Element, ElementContent, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const hasProperty = (element: Element, property: string) =>
  Object.hasOwn(element.properties, property);

const isElement = (node: ElementContent | undefined): node is Element =>
  node?.type === "element";

const createToolbarItem = (
  tagName: string,
  properties: Element["properties"],
  children: ElementContent[] = [],
): Element => ({
  type: "element",
  tagName,
  properties,
  children,
});

const createCopyIcon = (
  state: "copy" | "copied" | "error",
  children: ElementContent[],
) =>
  createToolbarItem(
    "svg",
    {
      "aria-hidden": "true",
      "data-copy-icon": state,
      fill: "none",
      height: "16",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      viewBox: "0 0 24 24",
      width: "16",
    },
    children,
  );

export const rehypeCodeBlocks: Plugin<[], Root> = () => (tree) => {
  let nextCodeBlockIndex = 0;

  visit(tree, "element", (figure) => {
    if (
      figure.tagName !== "figure" ||
      !hasProperty(figure, "data-rehype-pretty-code-figure")
    ) {
      return;
    }

    const preIndex = figure.children.findIndex(
      (child) => isElement(child) && child.tagName === "pre",
    );
    const pre = figure.children[preIndex];

    if (preIndex === -1 || !isElement(pre)) {
      return;
    }

    const language =
      typeof pre.properties.dataLanguage === "string"
        ? pre.properties.dataLanguage
        : typeof pre.properties["data-language"] === "string"
          ? pre.properties["data-language"]
          : "plaintext";
    const blockId = String(nextCodeBlockIndex);
    nextCodeBlockIndex += 1;

    figure.properties["data-code-block"] = "";
    figure.properties["data-code-block-index"] = blockId;

    const languageLabel = createToolbarItem(
      "span",
      {
        "data-code-block-language": "",
      },
      [{ type: "text", value: language }],
    );
    const copyButton = createToolbarItem(
      "button",
      {
        "aria-label": "Copy code",
        "data-copy-code": "",
        "data-copy-state": "idle",
        title: "Copy code",
        type: "button",
      },
      [
        createCopyIcon("copy", [
          // Tabler Icons (MIT): copy, check, and x, rendered at build time.
          createToolbarItem("path", {
            d: "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
          }),
          createToolbarItem("path", {
            d: "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
          }),
        ]),
        createCopyIcon("copied", [
          createToolbarItem("path", { d: "M5 12l5 5l10 -10" }),
        ]),
        createCopyIcon("error", [
          createToolbarItem("path", { d: "M18 6l-12 12" }),
          createToolbarItem("path", { d: "M6 6l12 12" }),
        ]),
      ],
    );
    const copyStatus = createToolbarItem("span", {
      "aria-live": "polite",
      "data-copy-code-status": "",
    });
    const actions = createToolbarItem(
      "span",
      {
        "data-code-block-actions": "",
        "data-code-block-index": blockId,
      },
      [copyButton, copyStatus],
    );
    const title = figure.children.find(
      (child) =>
        isElement(child) && hasProperty(child, "data-rehype-pretty-code-title"),
    );

    if (title && isElement(title)) {
      title.properties["data-code-block-title"] = "";
    }

    pre.children.push(languageLabel);
    figure.children.splice(preIndex, 0, actions);
  });
};
