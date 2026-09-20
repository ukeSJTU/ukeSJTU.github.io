export const siteConfig = {
  name: "ukeraser",
  description:
    "ukeraser's personal site. Notes on technology, learning, and making things.",
  url: "https://ukesjtu.github.io",
  locale: "en_US",
  language: "en-US",
  author: {
    name: "ukeraser",
    url: "https://github.com/ukeSJTU",
  },
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}
