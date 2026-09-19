export const siteConfig = {
  name: "ukeSJTU",
  description: "ukeSJTU 的个人站点，记录技术、学习与创作。",
  url: "https://ukesjtu.github.io",
  locale: "zh_CN",
  language: "zh-CN",
  author: {
    name: "ukeSJTU",
    url: "https://github.com/ukeSJTU",
  },
} as const;

export const socialImageConfig = {
  alt: `${siteConfig.name} — ${siteConfig.description}`,
  width: 1200,
  height: 630,
} as const;

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, `${siteConfig.url}/`).toString();
}
