import type { Element, ElementContent, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

function getText(node: ElementContent): string {
  if (node.type === "text") {
    return node.value;
  }

  if (node.type !== "element") {
    return "";
  }

  return node.children.map(getText).join("");
}

function getTaskText(item: Element) {
  return item.children
    .filter(
      (child) =>
        child.type !== "element" ||
        (child.tagName !== "ul" && child.tagName !== "ol"),
    )
    .map(getText)
    .join("")
    .trim();
}

export const rehypeTaskListLabels: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node, _index, parent) => {
    if (
      node.tagName !== "input" ||
      node.properties.type !== "checkbox" ||
      parent?.type !== "element" ||
      parent.tagName !== "li"
    ) {
      return;
    }

    const label = getTaskText(parent) || "Task";
    const state = node.properties.checked ? "Completed" : "Not completed";

    node.properties["aria-label"] = `${state}: ${label}`;
  });
};
