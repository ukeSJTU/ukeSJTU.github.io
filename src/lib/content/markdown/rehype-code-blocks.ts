import {
  IconCheck,
  IconCopy,
  IconX,
  type TablerIcon,
} from "@tabler/icons-react";
import type { Element, ElementContent, Root } from "hast";
import { fromHtml } from "hast-util-from-html";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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
  Icon: TablerIcon,
): Element => {
  const markup = renderToStaticMarkup(
    createElement(Icon, {
      "aria-hidden": true,
      size: 16,
    }),
  );
  const [icon] = fromHtml(markup, { fragment: true }).children;

  if (icon?.type !== "element") {
    throw new Error(`Could not render the ${state} code block icon`);
  }

  icon.properties["data-copy-icon"] = state;

  return icon;
};

export const rehypeCodeBlocks: Plugin<[], Root> = () => (tree) => {
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
    figure.properties["data-code-block"] = "";

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
        createCopyIcon("copy", IconCopy),
        createCopyIcon("copied", IconCheck),
        createCopyIcon("error", IconX),
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
