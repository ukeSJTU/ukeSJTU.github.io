import { allPosts } from "content-collections";
import { absoluteUrl } from "@/lib/site/config";

export type Post = (typeof allPosts)[number];

const POST_OG_IMAGE_VERSION = "1";

function hashString(value: string) {
  let hash = 0x811c9dc5;

  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
}

function getPostOgImageBasename(path: string) {
  const basename = path.split("/").at(-1) ?? "post";
  const safeBasename = basename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return safeBasename || "post";
}

export function parsePostDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function getPostPath(path: string) {
  return `/posts/${path}`;
}

export function getPostUrl(path: string) {
  return absoluteUrl(getPostPath(path));
}

export function getGeneratedPostOgImageFilename(post: Post) {
  const fingerprint = [
    POST_OG_IMAGE_VERSION,
    post._meta.path,
    post.title,
    post.summary,
    post.updatedAt ?? post.publishedAt,
  ].join("\0");

  return `${getPostOgImageBasename(post._meta.path)}-${hashString(fingerprint)}.png`;
}

export function getGeneratedPostOgImagePath(post: Post) {
  return `/og/generated/${getGeneratedPostOgImageFilename(post)}`;
}

export function getPostOgImage(post: Post) {
  const path = post.ogImage ?? getGeneratedPostOgImagePath(post);

  return {
    alt: post.title,
    path,
    url: absoluteUrl(path),
  };
}

export function getPostModifiedAt(post: Post) {
  return parsePostDate(getPostModifiedDate(post));
}

export function getPostModifiedDate(post: Post) {
  return post.updatedAt ?? post.publishedAt;
}

export const sortedPosts = [...allPosts].sort(
  (left, right) =>
    getPostModifiedAt(right).getTime() - getPostModifiedAt(left).getTime(),
);
