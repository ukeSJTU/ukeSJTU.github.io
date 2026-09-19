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
        "aria-label": `代码语言：${language}`,
        "data-code-block-language": "",
      },
      [{ type: "text", value: language }],
    );
    const copyButton = createToolbarItem(
      "button",
      {
        "aria-label": "复制代码",
        "data-copy-code": "",
        "data-copy-state": "idle",
        title: "复制代码",
        type: "button",
      },
      [
        createCopyIcon("copy", [
          createToolbarItem("rect", {
            height: "14",
            rx: "2",
            ry: "2",
            width: "14",
            x: "8",
            y: "8",
          }),
          createToolbarItem("path", {
            d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
          }),
        ]),
        createCopyIcon("copied", [
          createToolbarItem("path", { d: "m20 6-11 11-5-5" }),
        ]),
        createCopyIcon("error", [
          createToolbarItem("path", { d: "M18 6 6 18" }),
          createToolbarItem("path", { d: "m6 6 12 12" }),
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
