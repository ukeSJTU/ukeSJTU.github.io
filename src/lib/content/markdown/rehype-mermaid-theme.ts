import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { mermaidIdPrefix } from "./mermaid-options";

function getStringProperty(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export const rehypeMermaidTheme: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node) => {
    if (node.tagName !== "picture") {
      return;
    }

    const source = node.children.find(
      (child): child is Element =>
        child.type === "element" && child.tagName === "source",
    );
    const image = node.children.find(
      (child): child is Element =>
        child.type === "element" && child.tagName === "img",
    );

    if (!source || !image) {
      return;
    }

    const lightId = getStringProperty(image.properties.id);
    const darkId = getStringProperty(source.properties.id);
    const darkSource = getStringProperty(
      source.properties.srcSet ?? source.properties.srcset,
    );

    if (
      !lightId?.startsWith(`${mermaidIdPrefix}-`) ||
      !darkId?.startsWith(`${mermaidIdPrefix}-dark-`) ||
      !darkSource
    ) {
      return;
    }

    const lightImage: Element = {
      ...image,
      properties: {
        ...image.properties,
        dataMermaidTheme: "light",
      },
    };
    const darkImage: Element = {
      type: "element",
      tagName: "img",
      properties: {
        ...image.properties,
        dataMermaidTheme: "dark",
        height: source.properties.height,
        id: darkId,
        src: darkSource,
        width: source.properties.width,
      },
      children: [],
    };

    node.tagName = "figure";
    node.properties = { dataMermaidDiagram: "" };
    node.children = [lightImage, darkImage];
  });
};
