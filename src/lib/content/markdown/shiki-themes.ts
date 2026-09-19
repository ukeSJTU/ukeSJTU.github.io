import type { Theme } from "rehype-pretty-code";

type MonokaiPalette = {
  background: string;
  blue: string;
  comment: string;
  foreground: string;
  green: string;
  orange: string;
  pink: string;
  punctuation: string;
  purple: string;
  yellow: string;
};

function createMonokaiTheme(
  name: string,
  type: "light" | "dark",
  palette: MonokaiPalette,
): Theme {
  return {
    name,
    type,
    colors: {
      "editor.background": palette.background,
      "editor.foreground": palette.foreground,
    },
    settings: [
      {
        settings: {
          background: palette.background,
          foreground: palette.foreground,
        },
      },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: {
          fontStyle: "italic",
          foreground: palette.comment,
        },
      },
      {
        scope: ["string", "markup.heading", "markup.changed"],
        settings: { foreground: palette.yellow },
      },
      {
        scope: [
          "constant.numeric",
          "constant.language",
          "constant.character",
          "variable.other.constant",
          "entity.name.constant",
        ],
        settings: { foreground: palette.purple },
      },
      {
        scope: [
          "keyword",
          "storage",
          "keyword.operator",
          "entity.name.tag",
          "entity.name.function.operator",
        ],
        settings: { foreground: palette.pink },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "variable.function",
          "markup.underline.link",
          "markup.inserted",
        ],
        settings: { foreground: palette.green },
      },
      {
        scope: [
          "entity.name.class",
          "entity.name.type",
          "support.class",
          "support.variable",
          "entity.other.attribute-name",
        ],
        settings: { foreground: palette.blue },
      },
      {
        scope: ["storage.type", "support.type"],
        settings: {
          fontStyle: "italic",
          foreground: palette.blue,
        },
      },
      {
        scope: ["variable.parameter", "parameters variable.function"],
        settings: {
          fontStyle: "italic",
          foreground: palette.orange,
        },
      },
      {
        scope: ["punctuation", "meta.brace", "meta.delimiter"],
        settings: { foreground: palette.punctuation },
      },
      {
        scope: ["markup.deleted", "invalid"],
        settings: { foreground: palette.pink },
      },
      {
        scope: "invalid",
        settings: { fontStyle: "italic underline" },
      },
    ],
  };
}

export const monokaiProDarkTheme = createMonokaiTheme(
  "site-monokai-dark",
  "dark",
  {
    background: "#2d2a2e",
    blue: "#78dce8",
    comment: "#727072",
    foreground: "#fcfcfa",
    green: "#a9dc76",
    orange: "#fc9867",
    pink: "#ff6188",
    punctuation: "#939293",
    purple: "#ab9df2",
    yellow: "#ffd866",
  },
);

export const monokaiProLightSunTheme = createMonokaiTheme(
  "site-monokai-light-sun",
  "light",
  {
    background: "#f8efe7",
    blue: "#26639c",
    comment: "#675e64",
    foreground: "#2c232e",
    green: "#246b5e",
    orange: "#9d462c",
    pink: "#a13d5e",
    punctuation: "#675e64",
    purple: "#6851a2",
    yellow: "#8a540f",
  },
);
