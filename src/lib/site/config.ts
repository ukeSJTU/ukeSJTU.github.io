export const siteConfig = {
  name: "ukeraser",
  description:
    "ukeraser's personal site. Notes on technology, learning, and making things.",
  url: "https://ukeraser.is-a.dev",
  sourceUrl: "https://github.com/ukeSJTU/ukesjtu.github.io",
  locale: "en_US",
  language: "en-US",
  author: {
    name: "ukeraser",
    url: "https://github.com/ukeSJTU",
    email: "ez4uke@gmail.com",
    x: "https://x.com/ukeraser",
    codepen: "https://codepen.io/ukeraser",
  },
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}
