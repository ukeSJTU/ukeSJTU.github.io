import type { RehypeMermaidOptions } from "rehype-mermaid";

export const mermaidIdPrefix = "content-mermaid";

const diagramFontFamily =
  'Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';

export const mermaidOptions = {
  strategy: "img-svg",
  colorScheme: "light",
  prefix: mermaidIdPrefix,
  mermaidConfig: {
    theme: "base",
    securityLevel: "strict",
    fontFamily: diagramFontFamily,
    themeVariables: {
      background: "#f8efe7",
      primaryColor: "#fdf7f3",
      primaryTextColor: "#2c232e",
      primaryBorderColor: "#6851a2",
      secondaryColor: "#eee5de",
      secondaryTextColor: "#2c232e",
      secondaryBorderColor: "#218871",
      tertiaryColor: "#ded5d0",
      tertiaryTextColor: "#2c232e",
      tertiaryBorderColor: "#d4572b",
      lineColor: "#72696d",
      textColor: "#2c232e",
      noteBkgColor: "#fdf7f3",
      noteTextColor: "#2c232e",
      noteBorderColor: "#b16803",
    },
  },
  dark: {
    theme: "base",
    securityLevel: "strict",
    fontFamily: diagramFontFamily,
    themeVariables: {
      background: "#2d2a2e",
      primaryColor: "#403e41",
      primaryTextColor: "#fcfcfa",
      primaryBorderColor: "#ab9df2",
      secondaryColor: "#221f22",
      secondaryTextColor: "#fcfcfa",
      secondaryBorderColor: "#a9dc76",
      tertiaryColor: "#19181a",
      tertiaryTextColor: "#fcfcfa",
      tertiaryBorderColor: "#fc9867",
      lineColor: "#939293",
      textColor: "#fcfcfa",
      noteBkgColor: "#403e41",
      noteTextColor: "#fcfcfa",
      noteBorderColor: "#ffd866",
    },
  },
} satisfies RehypeMermaidOptions;
